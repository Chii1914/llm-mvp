'use client';

import Link from 'next/link';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { useBackend } from '@/context/BackendContext';
import { es } from '@/lib/translations';

export default function Navbar() {
  const { selectedDB } = useBackend();

  return (
    <BSNavbar bg="dark" expand="lg" sticky="top" className="mb-4">
      <Container>
        <BSNavbar.Brand href={selectedDB ? '/' : '/backend-select'} className="fw-bold text-light">
          {es.nav.title}
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {selectedDB && (
              <>
                <Nav.Link as={Link} href="/" className="text-light">
                  {es.nav.shop}
                </Nav.Link>
                <Nav.Link as={Link} href="/admin" className="text-light">
                  {es.nav.admin}
                </Nav.Link>
              </>
            )}
            <Nav.Link as={Link} href="/backend-select" className="text-light">
              {es.nav.backendSelect}
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
