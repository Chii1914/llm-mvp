export const es = {
  // Navigation
  nav: {
    title: '🛍️ Tienda de Ecommerce',
    shop: 'Tienda',
    admin: 'Administrador',
    backendSelect: 'Seleccionar Backend',
  },

  // Shop Page
  shop: {
    title: '🛒 Tienda',
    noProducts: 'No hay productos disponibles',
    quantity: 'Cantidad',
    buyNow: 'Comprar Ahora',
    outOfStock: 'Agotado',
    category: 'Categoría',
    price: 'Precio',
    stock: 'Stock',
    description: 'Descripción',
    purchaseSuccess: '✅ ¡Compra exitosa de {quantity} artículo(s)!',
    loadingProducts: 'Cargando productos...',
  },

  // Admin Page
  admin: {
    title: '🛠️ Administrador - Gestionar Productos',
    addNewProduct: '+ Agregar Nuevo Producto',
    noProducts: 'Sin productos aún. ¡Agrega uno para comenzar!',
    table: {
      name: 'Nombre',
      category: 'Categoría',
      price: 'Precio',
      stock: 'Stock',
      active: 'Activo',
      actions: 'Acciones',
      edit: 'Editar',
      delete: 'Eliminar',
      yes: '✅ Sí',
      no: '❌ No',
    },
    modal: {
      create: 'Crear Nuevo Producto',
      edit: 'Editar Producto',
      productName: 'Nombre del Producto *',
      description: 'Descripción',
      category: 'Categoría *',
      price: 'Precio *',
      stock: 'Stock',
      active: 'Activo',
      cancel: 'Cancelar',
      createBtn: 'Crear Producto',
      updateBtn: 'Actualizar Producto',
    },
    messages: {
      createSuccess: '✅ ¡Producto creado exitosamente!',
      updateSuccess: '✅ ¡Producto actualizado exitosamente!',
      deleteSuccess: '✅ ¡Producto eliminado exitosamente!',
      deleteConfirm: '¿Estás seguro de que deseas eliminar este producto?',
      validationError: 'Nombre, categoría y precio son requeridos',
    },
  },

  // Backend Selection
  backendSelect: {
    title: '🌐 Seleccionar Backend',
    selectDB: 'Elige una base de datos para comenzar',
    nosql: {
      title: 'NoSQL (MongoDB)',
      description: 'Base de datos NoSQL con MongoDB',
      select: 'Usar NoSQL',
    },
    mysql: {
      title: 'MySQL',
      description: '¡Tu turno Tiano!',
      select: 'Usar MySQL',
      comingSoon: 'Próximamente',
    },
  },

  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    failedLoad: 'Error al cargar productos',
    failedSave: 'Error al guardar producto',
    failedDelete: 'Error al eliminar producto',
    failedBuy: 'Error al comprar producto',
  },
};
