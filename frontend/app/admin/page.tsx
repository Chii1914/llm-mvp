'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form,
  Modal,
  Table,
  Spinner,
} from 'react-bootstrap';
import { Product, productService } from '@/lib/productService';
import { useBackend } from '@/context/BackendContext';
import { es } from '@/lib/translations';

export default function AdminPage() {
  const router = useRouter();
  const { selectedDB } = useBackend();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    active: true,
    category: { name: '' },
  });

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
      setProducts(data);
    } catch (err: any) {
      setError(err.message || es.common.failedLoad);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (product?: Product) => {
    if (product) {
      const productId = product._id || product.id_producto;
      const productName = product.name || product.nombre || '';
      const productDesc = product.description || product.descripcion || '';
      const productPrice = product.price ?? product.precio ?? 0;
      const productStock = product.stock ?? 0;
      const productActive = product.active !== undefined ? product.active : (product.activo !== undefined ? product.activo : true);
      const categoryName = product.category?.name || product.categoria?.nombre || '';
      
      setEditingId(productId?.toString() || null);
      setFormData({
        name: productName,
        description: productDesc,
        price: productPrice,
        stock: productStock,
        active: productActive,
        category: { name: categoryName },
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        active: true,
        category: { name: '' },
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (name === 'categoryName') {
      setFormData((prev) => ({
        ...prev,
        category: { name: value },
      }));
    } else if (name === 'active') {
      setFormData((prev) => ({
        ...prev,
        active: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  const handleSaveProduct = async () => {
    try {
      setError('');
      if (!formData.name || !formData.category.name || formData.price <= 0) {
        setError(es.admin.messages.validationError);
        return;
      }

      if (editingId) {
        await productService.update(editingId, formData);
        setSuccess(es.admin.messages.updateSuccess);
      } else {
        await productService.create(formData);
        setSuccess(es.admin.messages.createSuccess);
      }

      setTimeout(() => setSuccess(''), 3000);
      handleCloseModal();
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || es.common.failedSave);
    }
  };

  const handleDeleteProduct = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm(es.admin.messages.deleteConfirm)) return;

    try {
      setError('');
      await productService.delete(id);
      setSuccess(es.admin.messages.deleteSuccess);
      setTimeout(() => setSuccess(''), 3000);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || es.common.failedDelete);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{es.admin.title}</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          {es.admin.addNewProduct}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {products.length === 0 ? (
        <Alert variant="info">{es.admin.noProducts}</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>{es.admin.table.name}</th>
                <th>{es.admin.table.category}</th>
                <th>{es.admin.table.price}</th>
                <th>{es.admin.table.stock}</th>
                <th>{es.admin.table.active}</th>
                <th>{es.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const productId = product._id || product.id_producto;
                const productName = product.name || product.nombre;
                const categoryName = product.category?.name || product.categoria?.nombre;
                const productPrice = product.price || product.precio;
                const productActive = product.active !== undefined ? product.active : product.activo;
                
                return (
                <tr key={productId}>
                  <td>{productName}</td>
                  <td>{categoryName}</td>
                  <td>${productPrice}</td>
                  <td>{product.stock}</td>
                  <td>{productActive ? es.admin.table.yes : es.admin.table.no}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowModal(product)}
                      className="me-2"
                    >
                      {es.admin.table.edit}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(productId)}
                    >
                      {es.admin.table.delete}
                    </Button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? es.admin.modal.edit : es.admin.modal.create}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{es.admin.modal.productName}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre del producto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{es.admin.modal.description}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ingresa la descripción del producto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{es.admin.modal.category}</Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={formData.category.name}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre de la categoría"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{es.admin.modal.price}</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{es.admin.modal.stock}</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="active"
                label={es.admin.modal.active}
                checked={formData.active}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {es.admin.modal.cancel}
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editingId ? es.admin.modal.updateBtn : es.admin.modal.createBtn}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
