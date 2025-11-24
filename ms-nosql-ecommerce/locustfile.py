from locust import HttpUser, between, task
import random
import os

# Locust script for ms-nosql-ecommerce
# - Creates a few products on start (if not present)
# - Tasks: list products, get product, buy product

TARGET_HOST = os.getenv("TARGET_URL", "http://localhost:3000")

class EcommerceUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        # The HttpUser.client already points to the host passed to Locust CLI (--host),
        # but we keep TARGET_HOST for clarity. Use CLI or env to override.
        self.headers = {"Content-Type": "application/json"}
        self.product_ids = []

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
                        prod_id = data.get("_id") or data.get("id")
                        if prod_id:
                            self.product_ids.append(prod_id)
                    except Exception:
                        resp.failure("Invalid JSON when creating product")
                else:
                    # non-fatal: continue if product creation fails
                    pass

    @task(4)
    def list_products(self):
        self.client.get("/products", headers=self.headers)

    @task(3)
    def get_product(self):
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        self.client.get(f"/products/{pid}", headers=self.headers)

    @task(3)
    def buy_product(self):
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        quantity = random.randint(1, 5)
        with self.client.post(f"/products/{pid}/buy", json={"quantity": quantity}, headers=self.headers, catch_response=True) as resp:
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    # if stock is now 0 or absent, drop from local list
                    stock = data.get("stock")
                    if isinstance(stock, int) and stock <= 0:
                        try:
                            self.product_ids.remove(pid)
                        except ValueError:
                            pass
                except Exception:
                    # ignore malformed response
                    pass
            elif resp.status_code == 400:
                # likely insufficient stock — remove product to avoid repeated failures
                try:
                    self.product_ids.remove(pid)
                except ValueError:
                    pass
            else:
                # other responses - ignore
                pass

    @task(2)
    def update_product(self):
        """Randomly patch a product with new price/description/stock/active"""
        if not self.product_ids:
            return
        pid = random.choice(self.product_ids)
        payload = {}
        # randomly pick fields to update
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
                # product no longer exists
                try:
                    self.product_ids.remove(pid)
                except ValueError:
                    pass
            else:
                # ignore other responses
                pass

    @task(1)
    def delete_product(self):
        """Delete a random product to test DELETE endpoint and cleanup local list"""
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
                # ignore other responses
                pass

# NOTE: Run Locust in the project folder (ms-nosql-ecommerce) with:
#   pip install locust
#   locust -f locustfile.py --host=http://localhost:3000
# Or headless:
#   locust -f locustfile.py --headless -u 100 -r 10 --run-time 1m --host=http://localhost:3000
