'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { Product, productService } from '@/lib/productService';
import { useBackend } from '@/context/BackendContext';
import { es } from '@/lib/translations';

export default function ShopPage() {
  const router = useRouter();
  const { selectedDB } = useBackend();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!selectedDB) {
      router.push('/backend-select');
      return;
    }
    fetchProducts();
  }, [selectedDB, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getAll();
      setProducts(data.filter((p) => p.active || p.activo));
      setQuantities({});
    } catch (err: any) {
      setError(err.message || es.common.failedLoad);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string | undefined, qty: number) => {
    if (!productId) return;
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, qty),
    }));
  };

  const handleBuyProduct = async (productId: string | undefined) => {
    if (!productId) return;
    const quantity = quantities[productId] || 1;

    try {
      setError('');
      await productService.buy(productId, quantity);
      setSuccess(es.shop.purchaseSuccess.replace('{quantity}', quantity.toString()));
      setTimeout(() => setSuccess(''), 3000);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || es.common.failedBuy);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{es.common.loading}</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">{es.shop.title}</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {products.length === 0 ? (
        <Alert variant="info">{es.shop.noProducts}</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => {
            const productId = product._id || product.id_producto?.toString();
            const productName = product.name || product.nombre;
            const productDesc = product.description || product.descripcion;
            const productPrice = product.price || product.precio;
            const categoryName = product.category?.name || product.categoria?.nombre;
            return (
              <Col key={productId}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{productName}</Card.Title>
                    <Card.Text className="text-muted">{productDesc}</Card.Text>
                    <Card.Text>
                      <strong>{es.shop.category}:</strong> {categoryName}
                    </Card.Text>
                    <Card.Text>
                      <strong>{es.shop.price}:</strong> <span className="text-success">${productPrice}</span>
                    </Card.Text>
                    <Card.Text>
                      <strong>{es.shop.stock}:</strong> {product.stock > 0 ? product.stock : 'Agotado'}
                    </Card.Text>

                    {product.stock > 0 && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label className="small">{es.shop.quantity}</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantities[productId!] || 1}
                            onChange={(e) =>
                              handleQuantityChange(productId, parseInt(e.target.value))
                            }
                          />
                        </Form.Group>
                        <Button
                          variant="success"
                          className="w-100"
                          onClick={() => handleBuyProduct(productId)}
                        >
                          {es.shop.buyNow}
                        </Button>
                      </>
                    )}
                    {product.stock === 0 && (
                      <Button variant="secondary" className="w-100" disabled>
                        {es.shop.outOfStock}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
