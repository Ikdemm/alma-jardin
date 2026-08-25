# Especificación de Requerimientos de Software
## Plataforma Web para Restaurante Alma Jardín
---
## 1. Composición del Proyecto
El proyecto consiste en una plataforma digital integral para **Restaurante Alma Jardín**, orientada a presentar la propuesta gastronómica y artística del negocio, facilitar la reserva de mesas, la consulta del menú, la venta de obras de arte y la publicación de contenido editorial, mientras el equipo interno administra toda la información desde un panel privado con control de acceso basado en roles.
La experiencia de usuario tomará como referencia visual e interactiva el sitio [La Forchetta](https://laforchettasas.com/): diseño inmersivo, navegación fluida, animaciones tridimensionales sutiles, secciones narrativas y un enfoque mobile first que invite al visitante a explorar la marca, el menú y los servicios del restaurante.
La plataforma estará compuesta por dos aplicaciones web principales:
### Interfaz de Usuarios — Sitio Web Público
La interfaz de usuarios será un sitio web público, responsivo e inmersivo, optimizado principalmente para dispositivos móviles.
Permitirá a los visitantes y clientes:
- Conocer la historia, propuesta y valores del restaurante.
- Explorar el menú organizado por categorías y platos.
- Consultar precios, descripciones, ingredientes e imágenes de cada ítem.
- Navegar por la tienda de obras de arte disponibles para compra.
- Solicitar reservas de mesa en línea.
- Leer artículos del blog.
- Enviar mensajes de contacto.
- Iniciar conversaciones por WhatsApp para reservas, pedidos o consultas.
- Consultar información práctica: ubicación, horarios, redes sociales y testimonios.
### Panel de Administración — Sitio Web Privado
El panel de administración será una aplicación web privada, protegida mediante autenticación y control de acceso basado en roles (RBAC), con un modelo de permisos comparable al implementado en la plataforma Nesma Car Rental.
Permitirá al personal autorizado administrar:
- Administradores y permisos.
- Roles administrativos.
- Categorías del menú.
- Ítems del menú.
- Categorías y productos de la tienda de arte.
- Reservas.
- Publicaciones del blog.
- Mensajes de contacto.
- Banners y secciones destacadas del sitio.
- Configuración general del restaurante.
- Integración y mensajes de WhatsApp.
- Perfil del administrador.
---
# 2. Definiciones
**Visitante:** Persona que accede al sitio web público sin autenticarse.
**Cliente:** Persona que interactúa con la plataforma para reservar, comprar o contactar al restaurante. Puede actuar como visitante o, en fases posteriores, como usuario registrado si el cliente lo requiere.
**Administrador:** Usuario autorizado para acceder al panel administrativo y gestionar la plataforma.
**Super administrador:** Usuario con acceso total al panel, incluyendo la gestión de roles, permisos y administradores.
**Rol administrativo:** Conjunto configurable de permisos asignable a uno o varios administradores.
**Permiso:** Acción granular sobre un módulo del sistema (por ejemplo: leer, crear, actualizar o eliminar reservas).
**Categoría del menú:** Clasificación principal o secundaria de los platos (por ejemplo: Entradas, Pizzas, Pastas, Postres, Bebidas).
**Ítem del menú:** Plato, bebida o producto gastronómico disponible en el menú del restaurante.
**Categoría de tienda:** Clasificación de las obras de arte u objetos comercializables.
**Producto de tienda / Obra de arte:** Pieza artística u objeto disponible para consulta y compra a través del sitio.
**Reserva:** Solicitud de mesa realizada por un visitante o cliente, sujeta a confirmación o rechazo por parte del restaurante.
**Publicación / Artículo del blog:** Contenido editorial publicado en el sitio (historias, recetas, ingredientes, eventos, noticias).
**Mensaje de contacto:** Solicitud enviada por un visitante a través del formulario de contacto.
**Banner:** Elemento gráfico promocional mostrado en una o varias secciones del sitio.
**Sección destacada:** Bloque configurable de la página principal utilizado para promover menú, obras, blog, reservas u otros contenidos.
**WhatsApp flotante / CTA:** Acceso directo a conversación por WhatsApp con mensaje predefinido configurable.
**Estado de reserva:** Condición actual de una reserva (por ejemplo: pendiente, confirmada, rechazada, cancelada).
**Estado de producto:** Condición de disponibilidad de un ítem del menú o de la tienda (activo, agotado, oculto).
---
# 3. Requisitos
# Actor 1: Administrador
## 3.1 Módulo de Autenticación
El administrador podrá iniciar sesión en el panel administrativo utilizando su correo electrónico y contraseña.
El sistema deberá validar las credenciales antes de permitir el acceso.
El administrador podrá cerrar sesión.
El administrador podrá solicitar el restablecimiento de su contraseña en caso de olvidarla.
El administrador ingresará su correo electrónico.
El sistema enviará un código de verificación o enlace de recuperación al correo electrónico registrado.
El administrador podrá definir una nueva contraseña.
El sistema deberá validar que la nueva contraseña cumpla con los requisitos mínimos de seguridad.
Las rutas administrativas deberán estar protegidas y únicamente podrán ser utilizadas por usuarios autenticados con los permisos correspondientes.
El sistema deberá impedir el acceso a administradores bloqueados, pendientes de activación o inactivos.
---
# 3.2 Módulo de Gestión de Roles y Permisos
El sistema implementará un modelo de **Control de Acceso Basado en Roles (RBAC)** similar al utilizado en Nesma Car Rental.
El super administrador o el administrador autorizado podrá visualizar una lista paginada de roles administrativos.
El administrador podrá crear un nuevo rol con la siguiente información:
- Nombre.
- Descripción.
- Color identificador (opcional).
- Permisos.
El administrador podrá asignar permisos específicos a cada rol.
Los permisos estarán organizados por módulo y acción. Como mínimo se contemplan permisos de lectura, creación, actualización y eliminación para:
- Administradores.
- Roles.
- Categorías del menú.
- Ítems del menú.
- Categorías de tienda.
- Productos de tienda.
- Reservas.
- Publicaciones del blog.
- Mensajes de contacto.
- Banners.
- Secciones destacadas.
- Configuración general.
- Integraciones de WhatsApp.
El administrador podrá modificar los permisos de un rol existente.
El administrador podrá actualizar el nombre, descripción y color de un rol.
El administrador podrá activar o desactivar un rol.
El sistema deberá calcular los permisos efectivos de un administrador como la unión de:
- Los permisos de los roles asignados.
- Los permisos adicionales otorgados directamente al administrador, cuando aplique.
El super administrador tendrá acceso total sin depender de roles asignados.
El panel administrativo deberá ocultar menús, acciones y rutas para las cuales el administrador no tenga permiso de lectura.
El backend deberá validar permisos en cada operación sensible, independientemente de las restricciones visuales del frontend.
---
# 3.3 Módulo de Gestión de Administradores
El administrador autorizado podrá visualizar una lista paginada de administradores.
El administrador podrá buscar administradores por:
- Nombre.
- Apellido.
- Correo electrónico.
El administrador podrá filtrar administradores por estado.
El administrador podrá crear o invitar a un nuevo administrador proporcionando:
- Nombre.
- Apellido.
- Correo electrónico.
- Número de teléfono.
- Rol o roles administrativos.
El sistema podrá enviar automáticamente un correo electrónico al nuevo administrador para completar su proceso de activación.
El administrador podrá bloquear una cuenta administrativa.
