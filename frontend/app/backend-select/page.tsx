'use client';

import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useBackend } from '@/context/BackendContext';
import { es } from '@/lib/translations';

export default function BackendSelectionPage() {
  const router = useRouter();
  const { setSelectedDB } = useBackend();

  const handleSelectNoSQL = () => {
    setSelectedDB('nosql');
    router.push('/');
  };

  const handleSelectMySQL = () => {
    setSelectedDB('mysql');
    router.push('/');
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="mb-4">{es.backendSelect.title}</h1>
        <p className="text-muted fs-5">{es.backendSelect.selectDB}</p>
      </div>

      <Row xs={1} md={2} className="g-4 justify-content-center">
        {/* NoSQL Card */}
        <Col md={5}>
          <Card className="h-100 shadow-lg border-primary">
            <Card.Body className="text-center">
              <h3 className="mb-3">📦 {es.backendSelect.nosql.title}</h3>
              <p className="text-muted mb-4">{es.backendSelect.nosql.description}</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSelectNoSQL}
                className="w-100"
              >
                {es.backendSelect.nosql.select}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* MySQL Card */}
        <Col md={5}>
          <Card className="h-100 shadow-lg border-success">
            <Card.Body className="text-center">
              <h3 className="mb-3">🗄️ {es.backendSelect.mysql.title}</h3>
              <p className="text-muted mb-4">{es.backendSelect.mysql.description}</p>
              <Button
                variant="success"
                size="lg"
                onClick={handleSelectMySQL}
                className="w-100"
              >
                {es.backendSelect.mysql.select}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
