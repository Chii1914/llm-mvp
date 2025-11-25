"""
Unified Locust load test for both ms-nosql-ecommerce and ms-mysql-ecommerce
This script tests both APIs (NoSQL and MySQL) from a single configuration.

Usage:
  # Test only NoSQL (default):
  locust -f locustfile_unified.py --host=http://localhost:3000

  # Test only MySQL:
  locust -f locustfile_unified.py --host=http://localhost:3002

  # Test both sequentially using a custom runner:
  python locustfile_unified.py --test-both

  # Headless mode (NoSQL):
  locust -f locustfile_unified.py --host=http://localhost:3000 --headless -u 10 -r 2 --run-time 5m

  # Headless mode (MySQL):
  locust -f locustfile_unified.py --host=http://localhost:3002 --headless -u 10 -r 2 --run-time 5m
"""

from locust import HttpUser, between, task, events
import random
import os
import sys

# Support environment variables to override defaults
TARGET_HOST = os.getenv("TARGET_URL", "http://localhost:3000")
BACKEND_TYPE = os.getenv("BACKEND_TYPE", "nosql")  # "nosql" or "mysql"

class EcommerceUser(HttpUser):
    """
    Base user class that tests both NoSQL and MySQL e-commerce APIs.
    The key difference is how product IDs are extracted from responses.
    """
    wait_time = between(1, 3)

    def on_start(self):
        self.headers = {"Content-Type": "application/json"}
        self.product_ids = []
        self.backend = BACKEND_TYPE  # Track which backend we're testing

        # Create a few products so tests have items to work with.
        for _ in range(3):
            payload = {
                "name": f"locust-product-{random.randint(1000,9999)}",
                "description": "Created by Locust",
                "price": round(random.uniform(5, 500), 2),
                "stock": random.randint(1, 30),
                "active": True,
                "category": {"name": "locust"},
            }
            with self.client.post("/products", json=payload, headers=self.headers, catch_response=True) as resp:
                if resp.status_code in (200, 201) and resp.text:
                    try:
                        data = resp.json()
                        # Support both MongoDB (_id) and MySQL (id_producto) formats
                        prod_id = data.get("id_producto") or data.get("_id") or data.get("id")
                        if prod_id:
                            self.product_ids.append(prod_id)
                    except Exception:
                        resp.failure("Invalid JSON when creating product")
                else:
                    pass

    @task(4)
    def list_products(self):
        """List all products (40% of traffic)"""
        with self.client.get("/products", headers=self.headers, catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"Unexpected status code: {resp.status_code}")

    @task(3)
    def get_product(self):
        """Get a single product (30% of traffic)"""
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        with self.client.get(f"/products/{pid}", headers=self.headers, catch_response=True) as resp:
            if resp.status_code != 200:
                resp.failure(f"Failed to get product {pid}: {resp.status_code}")

    @task(3)
    def buy_product(self):
        """Buy a product (30% of traffic)"""
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        quantity = random.randint(1, 5)
        with self.client.post(f"/products/{pid}/buy", json={"quantity": quantity}, headers=self.headers, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    stock = data.get("stock")
                    if isinstance(stock, int) and stock <= 0:
                        try:
                            self.product_ids.remove(pid)
                        except ValueError:
                            pass
                except Exception:
                    pass
            elif resp.status_code == 400:
                # Insufficient stock
                try:
                    self.product_ids.remove(pid)
                except ValueError:
                    pass
            else:
                resp.failure(f"Unexpected status code for buy: {resp.status_code}")

    @task(2)
    def update_product(self):
        """Update a product (20% of traffic)"""
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        payload = {}
        
        if random.random() < 0.7:
            payload['price'] = round(random.uniform(1, 1500), 2)
        if random.random() < 0.6:
            payload['description'] = f"Updated by Locust {random.randint(1,100)}"
        if random.random() < 0.5:
            payload['stock'] = random.randint(0, 100)
        if random.random() < 0.2:
            payload['active'] = bool(random.choice([True, False]))

        if not payload:
            return

        with self.client.patch(f"/products/{pid}", json=payload, headers=self.headers, catch_response=True) as resp:
            if resp.status_code in (200, 201):
                try:
                    data = resp.json()
                    stock = data.get('stock')
                    if isinstance(stock, int) and stock <= 0:
                        try:
                            self.product_ids.remove(pid)
                        except ValueError:
                            pass
                except Exception:
                    pass
            elif resp.status_code == 404:
                try:
                    self.product_ids.remove(pid)
                except ValueError:
                    pass
            else:
                resp.failure(f"Unexpected status code for update: {resp.status_code}")

    @task(1)
    def delete_product(self):
        """Delete a product (10% of traffic)"""
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        with self.client.delete(f"/products/{pid}", headers=self.headers, catch_response=True) as resp:
            if resp.status_code in (200, 202, 204):
                try:
                    self.product_ids.remove(pid)
                except ValueError:
                    pass
            elif resp.status_code == 404:
                try:
                    self.product_ids.remove(pid)
                except ValueError:
                    pass
            else:
                resp.failure(f"Unexpected status code for delete: {resp.status_code}")


# Event handler to log test start
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print(f"\n{'='*60}")
    print(f"Starting load test with backend: {BACKEND_TYPE.upper()}")
    print(f"Target: {TARGET_HOST}")
    print(f"{'='*60}\n")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print(f"\n{'='*60}")
    print(f"Load test completed for: {BACKEND_TYPE.upper()}")
    print(f"{'='*60}\n")


# Script runner for testing both backends sequentially
if __name__ == "__main__":
    import subprocess
    
    if "--test-both" in sys.argv:
        print("Testing both NoSQL and MySQL backends sequentially...\n")
        
        # Test NoSQL
        print("1. Testing NoSQL Backend (ms-nosql-ecommerce on port 3000)...")
        print("-" * 60)
        os.environ["BACKEND_TYPE"] = "nosql"
        subprocess.run([
            "locust",
            "-f", "locustfile_unified.py",
            "--host=http://localhost:3000",
            "--headless",
            "-u", "10",
            "-r", "2",
            "--run-time", "2m"
        ])
        
        print("\n" + "=" * 60)
        print("Waiting 30 seconds before testing MySQL...\n")
        import time
        time.sleep(30)
        
        # Test MySQL
        print("2. Testing MySQL Backend (ms-mysql-ecommerce on port 3002)...")
        print("-" * 60)
        os.environ["BACKEND_TYPE"] = "mysql"
        subprocess.run([
            "locust",
            "-f", "locustfile_unified.py",
            "--host=http://localhost:3002",
            "--headless",
            "-u", "10",
            "-r", "2",
            "--run-time", "2m"
        ])
        
        print("\n" + "=" * 60)
        print("Both tests completed!")
        print("=" * 60 + "\n")
    else:
        print("Unified Locust file loaded.")
        print("Run with: locust -f locustfile_unified.py --host=http://localhost:3000")
        print("Or test both: python locustfile_unified.py --test-both")
