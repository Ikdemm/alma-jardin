# Especificación de Requerimientos de Software

## Plataforma para Droguería Virtual

---

## 1. Composición del Proyecto

El proyecto consiste en una plataforma digital de comercio electrónico para una droguería en Colombia, que permitirá a los clientes consultar el catálogo de productos, conocer precios y promociones, realizar compras en línea y seleccionar diferentes modalidades de entrega o recogida.

La plataforma estará compuesta por dos aplicaciones web principales:

### Interfaz de Usuarios — Sitio Web Público

La interfaz de usuarios será un sitio web público y responsivo orientado principalmente a dispositivos móviles.

Permitirá a los clientes:

- Explorar el catálogo de productos.
- Navegar por categorías y subcategorías.
- Buscar productos.
- Consultar información detallada de los productos.
- Agregar productos al carrito.
- Realizar compras como visitante o usuario registrado.
- Aplicar códigos promocionales.
- Utilizar puntos de fidelización.
- Seleccionar entre entrega a domicilio y recogida.
- Seleccionar diferentes métodos de pago.
- Consultar el estado de sus pedidos.
- Administrar su cuenta y direcciones de entrega.

Adicionalmente, la plataforma podrá ser accedida mediante códigos QR ubicados dentro del complejo comercial, permitiendo al usuario acceder a una versión optimizada de la experiencia de compra para pedidos realizados desde el interior del establecimiento o centro comercial.

### Panel de Administración — Sitio Web Privado

El panel de administración será una aplicación web privada y protegida mediante autenticación.

Permitirá al personal autorizado administrar:

- Administradores y permisos.
- Clientes.
- Categorías.
- Marcas.
- Productos.
- Inventario.
- Pedidos.
- Agencias.
- Promociones y códigos promocionales.
- Puntos de fidelización.
- Banners.
- Secciones destacadas.
- Configuración del perfil.
- Integraciones con sistemas externos.
- Sincronización de inventario.

---

# 2. Definiciones

**Cliente:** Persona que utiliza la plataforma para consultar productos y realizar pedidos.

**Administrador:** Usuario autorizado para acceder al panel administrativo y gestionar la plataforma.

**Agencia:** Droguería, punto de venta o establecimiento físico encargado de preparar y/o entregar los pedidos correspondientes a una determinada zona geográfica.

**Producto:** Artículo disponible para comercialización a través de la plataforma.

**Categoría:** Clasificación principal de los productos.

**Subcategoría:** Clasificación secundaria asociada a una categoría.

**Sub-subcategoría:** Nivel adicional de clasificación dentro de una subcategoría.

**Banner:** Elemento gráfico promocional mostrado en una o varias secciones de la plataforma.

**Sección destacada:** Sección configurable de la página principal utilizada para promocionar productos, categorías, marcas u otros contenidos.

**Código promocional:** Código que permite aplicar un beneficio o descuento a una compra bajo determinadas condiciones.

**Puntos de fidelización:** Puntos acumulados por los clientes como consecuencia de sus compras y que podrán ser utilizados posteriormente de acuerdo con las reglas definidas por la droguería.

**Pedido:** Solicitud de compra realizada por un cliente a través de la plataforma.

**Entrega:** Modalidad mediante la cual el pedido es enviado a la dirección indicada por el cliente.

**Recogida:** Modalidad mediante la cual el cliente recoge personalmente su pedido en una agencia o punto de venta seleccionado.

**Sincronización de inventario:** Proceso mediante el cual la plataforma actualiza la información de existencias desde un sistema externo mediante API o archivos CSV.

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

Las rutas administrativas deberán estar protegidas y únicamente podrán ser utilizadas por usuarios autenticados.

---

# 3.2 Módulo de Gestión de Roles y Permisos

El administrador autorizado podrá visualizar una lista paginada de roles administrativos.

El administrador podrá crear un nuevo rol con la siguiente información:

- Nombre.
- Descripción.
- Permisos.

El administrador podrá asignar permisos específicos a cada rol.

Los permisos podrán estar asociados a diferentes módulos de la plataforma, incluyendo:

- Clientes.
- Administradores.
- Roles.
- Categorías.
- Marcas.
- Productos.
- Pedidos.
- Agencias.
- Banners.
- Secciones destacadas.
- Códigos promocionales.
- Puntos de fidelización.
- Inventario.
- Sincronización de inventario.

El administrador podrá modificar los permisos de un rol existente.

El administrador podrá actualizar el nombre y descripción de un rol.

El administrador podrá activar o desactivar un rol.

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
- Rol.

El sistema podrá enviar automáticamente un correo electrónico al nuevo administrador para completar su proceso de activación.

El administrador podrá bloquear una cuenta administrativa.

El administrador podrá reactivar una cuenta previamente bloqueada.

El administrador podrá consultar la información básica de cada administrador.

---

# 3.4 Módulo de Gestión de Categorías

El sistema permitirá administrar una estructura jerárquica de categorías de hasta tres niveles:

- Categoría raíz.
- Subcategoría.
- Sub-subcategoría.

El administrador podrá visualizar el árbol de categorías.

El administrador podrá crear una categoría raíz.

El administrador podrá crear una subcategoría asociada a una categoría raíz.

El administrador podrá crear una sub-subcategoría asociada a una subcategoría.

Cada categoría podrá contener:

- Imagen.
- Nombre.
- Descripción.
- Categoría padre.
- Orden de visualización.
- Estado.

El administrador podrá editar una categoría existente.

El administrador podrá modificar su categoría padre cuando corresponda.

El administrador podrá activar una categoría.

El administrador podrá desactivar una categoría para ocultarla del sitio público.

El administrador podrá eliminar una categoría cuando no existan dependencias que impidan su eliminación.

El sistema deberá evitar la eliminación de categorías que tengan productos asociados sin realizar previamente las acciones necesarias de reasignación o desactivación.

---

# 3.5 Módulo de Gestión de Marcas

El administrador podrá visualizar una lista paginada de marcas.

El administrador podrá buscar marcas por nombre.

El administrador podrá filtrar marcas por estado.

El administrador podrá crear una nueva marca con:

- Nombre.
- Logo.
- Descripción.
- Estado.

El administrador podrá editar una marca existente.

El administrador podrá activar o desactivar una marca.

El administrador podrá eliminar una marca cuando no existan dependencias que impidan su eliminación.

El sitio público podrá mostrar una sección de marcas destacadas.

---

# 3.6 Módulo de Gestión de Productos

El administrador podrá visualizar una lista paginada de productos.

El administrador podrá buscar productos por:

- Nombre.
- Código.
- SKU.
- Marca.

El administrador podrá filtrar productos por:

- Categoría.
- Marca.
- Estado.
- Disponibilidad.
- Rango de precio.

El administrador podrá crear un nuevo producto.

El producto podrá contener como mínimo:

- Nombre.
- Código interno.
- SKU.
- Código de barras, cuando aplique.
- Descripción corta.
- Descripción completa.
- Marca.
- Categoría.
- Subcategoría.
- Sub-subcategoría.
- Imágenes.
- Precio.
- Precio promocional.
- Estado.
- Disponibilidad.
- Información de presentación.
- Unidad de medida.
- Cantidad por presentación.
- Peso o volumen cuando aplique.

El administrador podrá agregar múltiples imágenes a un producto.

El administrador podrá definir una imagen principal.

El administrador podrá editar un producto existente.

El administrador podrá activar o desactivar un producto.

El administrador podrá establecer si un producto puede ser vendido en línea.

El administrador podrá establecer la disponibilidad del producto.

El sistema deberá permitir manejar productos con diferentes presentaciones cuando corresponda.

El sistema deberá permitir asociar el inventario disponible a una o varias agencias.

---

# 3.7 Módulo de Gestión de Inventario

El administrador podrá consultar la disponibilidad de productos.

El sistema podrá manejar inventario por agencia.

El administrador podrá consultar la cantidad disponible de un producto en cada agencia.

El sistema deberá evitar que un cliente pueda comprar cantidades superiores a las existencias disponibles, de acuerdo con las reglas de inventario configuradas.

El sistema deberá actualizar las existencias cuando se genere un pedido, de acuerdo con la estrategia de reserva definida.

El sistema deberá contemplar la actualización del inventario después de la cancelación de un pedido.

El administrador podrá consultar información relacionada con la última actualización del inventario.

---

# 3.8 Módulo de Sincronización de Inventario

La plataforma deberá permitir la sincronización del inventario con un sistema externo utilizado actualmente por la droguería.

La integración podrá realizarse mediante:

- API.
- Archivo CSV.

### Sincronización mediante API

El sistema podrá consultar periódicamente el sistema externo para obtener:

- Productos.
- SKU.
- Códigos.
- Precios, cuando corresponda.
- Existencias.
- Agencia o punto de venta.
- Estado del producto.

El sistema deberá registrar los resultados de cada sincronización.

### Sincronización mediante CSV

El administrador podrá cargar un archivo CSV.

El sistema deberá validar la estructura del archivo antes de procesarlo.

El sistema deberá identificar registros inválidos.

El sistema deberá mostrar un resumen del proceso:

- Registros procesados.
- Registros actualizados.
- Registros creados, cuando aplique.
- Registros rechazados.
- Errores encontrados.

El sistema deberá mantener un registro de las sincronizaciones realizadas.

---

# 3.9 Módulo de Gestión de Agencias

El administrador podrá visualizar una lista paginada de agencias.

El administrador podrá buscar agencias por nombre.

El administrador podrá filtrar agencias por estado y ubicación.

El administrador podrá crear una nueva agencia con:

- Nombre.
- Dirección.
- Ciudad.
- Departamento.
- Teléfono.
- Correo electrónico.
- Coordenadas geográficas, cuando aplique.
- Horarios de atención.
- Estado.

El administrador podrá editar una agencia existente.

El administrador podrá activar o desactivar una agencia.

El administrador podrá definir las zonas geográficas atendidas por una agencia.

---

# 3.10 Asignación Automática de Agencia

El sistema deberá determinar automáticamente la agencia responsable de un pedido de acuerdo con la dirección de entrega del cliente.

El sistema deberá utilizar las reglas de cobertura configuradas para las agencias.

El sistema podrá determinar la agencia mediante:

- Ciudad.
- Departamento.
- Código postal.
- Zona.
- Barrio.
- Coordenadas geográficas.
- Polígonos o zonas configuradas, cuando aplique.

Cuando una dirección pueda ser atendida por varias agencias, el sistema deberá aplicar las reglas de prioridad definidas.

Cuando ninguna agencia pueda atender la dirección, el sistema deberá informar al cliente que la zona no está disponible para entrega.

La asignación de agencia deberá realizarse antes de confirmar el pedido cuando sea necesaria para determinar disponibilidad o costos de entrega.

El administrador deberá poder consultar y modificar manualmente la agencia asignada cuando tenga los permisos correspondientes.

---

# 3.11 Módulo de Gestión de Pedidos

El administrador podrá visualizar una lista paginada de pedidos.

El administrador podrá buscar pedidos por:

- Número de pedido.
- Nombre del cliente.
- Correo electrónico.
- Teléfono.

El administrador podrá filtrar pedidos por:

- Estado.
- Fecha.
- Agencia.
- Tipo de pedido.
- Método de pago.

El administrador podrá visualizar el detalle completo de un pedido.

El pedido deberá contener:

- Número de pedido.
- Fecha.
- Cliente.
- Productos.
- Cantidades.
- Precio unitario.
- Descuentos.
- Código promocional.
- Puntos utilizados.
- Subtotal.
- Costo de entrega.
- Total.
- Método de pago.
- Tipo de pedido.
- Dirección de entrega, cuando aplique.
- Agencia asignada.
- Estado del pago.
- Estado del pedido.

El sistema deberá manejar diferentes estados de pedido, por ejemplo:

- Pendiente.
- Confirmado.
- En preparación.
- Listo para recoger.
- En camino.
- Entregado.
- Recogido.
- Cancelado.

Los estados definitivos podrán ser ajustados durante la etapa de definición funcional.

El administrador podrá actualizar el estado de un pedido.

El sistema deberá registrar la fecha y usuario responsable de los cambios relevantes realizados sobre el pedido.

---

# 3.12 Módulo de Gestión de Códigos Promocionales

El administrador podrá visualizar una lista paginada de códigos promocionales.

El administrador podrá buscar códigos por nombre o código.

El administrador podrá filtrar códigos por:

- Estado.
- Fecha de inicio.
- Fecha de finalización.
- Tipo de descuento.

El administrador podrá crear un código promocional con:

- Código.
- Descripción.
- Tipo de descuento.
- Valor del descuento.
- Fecha de inicio.
- Fecha de finalización.
- Compra mínima, cuando aplique.
- Valor máximo de descuento, cuando aplique.
- Número máximo de usos.
- Número máximo de usos por cliente.
- Productos aplicables, cuando aplique.
- Categorías aplicables, cuando aplique.
- Marcas aplicables, cuando aplique.
- Estado.

El sistema deberá validar las condiciones del código antes de aplicarlo a un pedido.

El administrador podrá activar, desactivar y editar códigos promocionales.

---

# 3.13 Módulo de Fidelización y Puntos

El sistema deberá permitir la acumulación de puntos por parte de los clientes.

El administrador podrá configurar las reglas mediante las cuales los clientes obtienen puntos.

El sistema deberá registrar los puntos obtenidos por cada pedido.

Los puntos deberán ser acreditados de acuerdo con las condiciones configuradas, por ejemplo después de completar satisfactoriamente un pedido.

El cliente podrá visualizar su saldo de puntos.

El cliente podrá visualizar el historial de movimientos de puntos.

El sistema deberá registrar:

- Puntos ganados.
- Puntos utilizados.
- Puntos ajustados.
- Fecha.
- Pedido relacionado, cuando aplique.
- Motivo.

El administrador autorizado podrá realizar ajustes manuales de puntos.

El sistema deberá mantener trazabilidad de los ajustes realizados.

---

# 3.14 Módulo de Gestión de Banners

El administrador podrá visualizar una lista paginada de banners.

El administrador podrá crear un banner.

Cada banner podrá contener:

- Nombre.
- Imagen desktop.
- Imagen mobile.
- Título.
- Descripción.
- Tipo de destino.
- Destino.
- Fecha de inicio.
- Fecha de finalización.
- Orden de visualización.
- Estado.

El destino de un banner podrá ser:

- Producto.
- Categoría.
- Marca.
- Sección de la plataforma.
- URL externa.
- Ninguno.

El administrador podrá editar un banner.

El administrador podrá activar o desactivar un banner.

El administrador podrá definir las fechas de publicación.

El sistema deberá mostrar únicamente banners activos dentro del período de vigencia configurado.

---

# 3.15 Módulo de Gestión de Secciones Destacadas

El administrador podrá crear y administrar diferentes secciones de contenido dentro de la página principal.

Las secciones podrán utilizarse para mostrar:

- Productos destacados.
- Productos en promoción.
- Categorías destacadas.
- Marcas destacadas.
- Productos recomendados.
- Productos más vendidos.
- Nuevos productos.
- Ofertas.
- Contenido promocional.

El administrador podrá definir:

- Nombre de la sección.
- Tipo de contenido.
- Productos asociados.
- Categorías asociadas.
- Marcas asociadas.
- Imagen, cuando aplique.
- Orden.
- Fecha de inicio.
- Fecha de finalización.
- Estado.

El administrador podrá activar, desactivar, editar y eliminar secciones.

---

# 3.16 Módulo de Gestión de Clientes

El administrador podrá visualizar una lista paginada de clientes.

El administrador podrá buscar clientes por:

- Nombre.
- Correo electrónico.
- Número de teléfono.
- Identificación, cuando aplique.

El administrador podrá filtrar clientes por estado.

El administrador podrá consultar la información de un cliente.

La información podrá incluir:

- Nombre.
- Apellido.
- Correo electrónico.
- Número de teléfono.
- Tipo de identificación.
- Número de identificación.
- Direcciones registradas.
- Pedidos realizados.
- Puntos disponibles.
- Historial de puntos.
- Estado de la cuenta.

El administrador podrá bloquear o desbloquear una cuenta de cliente cuando corresponda.

---

# 3.17 Gestión de Perfil del Administrador

El administrador podrá visualizar su información de perfil.

El administrador podrá actualizar:

- Nombre.
- Apellido.
- Correo electrónico.
- Número de teléfono.
- Imagen de perfil.

El administrador podrá actualizar su contraseña.

---

# Actor 2: Cliente / Visitante

# 4.1 Página Principal

El visitante podrá acceder a la plataforma mediante un enlace directo.

El visitante podrá acceder a la plataforma mediante un código QR.

La página principal podrá mostrar:

- Banners.
- Categorías destacadas.
- Productos destacados.
- Ofertas.
- Marcas destacadas.
- Productos recomendados.
- Secciones promocionales.

El contenido mostrado deberá ser configurable desde el panel administrativo.

La página principal deberá estar optimizada para dispositivos móviles.

---

# 4.2 Navegación por Categorías

El cliente podrá visualizar las categorías disponibles.

El cliente podrá navegar por:

- Categorías raíz.
- Subcategorías.
- Sub-subcategorías.

El cliente podrá seleccionar una categoría para consultar los productos asociados.

El sistema deberá permitir una navegación sencilla entre los diferentes niveles de categorías.

---

# 4.3 Búsqueda de Productos

El cliente podrá utilizar una barra de búsqueda.

El cliente podrá buscar productos mediante:

- Nombre.
- Marca.
- Código.
- Palabras relacionadas.

El sistema deberá mostrar resultados relevantes.

El cliente podrá filtrar los resultados por diferentes criterios.

Los filtros podrán incluir:

- Categoría.
- Marca.
- Precio.
- Disponibilidad.
- Promociones.

El cliente podrá ordenar los resultados por:

- Relevancia.
- Precio menor a mayor.
- Precio mayor a menor.
- Nombre.
- Productos destacados.

---

# 4.4 Página de Producto

El cliente podrá consultar el detalle de un producto.

La página deberá mostrar, cuando la información esté disponible:

- Imagen principal.
- Imágenes adicionales.
- Nombre.
- Marca.
- Descripción.
- Precio.
- Precio promocional.
- Presentación.
- Disponibilidad.
- Información relevante del producto.
- Cantidad disponible, cuando corresponda.

El cliente podrá seleccionar la cantidad que desea comprar.

El cliente podrá agregar el producto al carrito.

---

# 4.5 Productos Similares y Recomendados

La página de producto podrá mostrar productos similares.

También podrán mostrarse:

- Productos relacionados.
- Productos de la misma categoría.
- Productos de la misma marca.
- Productos frecuentemente comprados juntos.
- Productos recomendados.

Las reglas de recomendación podrán ser configurables posteriormente.

---

# 4.6 Carrito de Compra

El cliente podrá agregar productos al carrito.

El cliente podrá visualizar:

- Productos agregados.
- Cantidad.
- Precio unitario.
- Descuentos.
- Subtotal.
- Costo de entrega, cuando aplique.
- Puntos utilizados.
- Total.

El cliente podrá modificar las cantidades.

El cliente podrá eliminar productos.

El sistema deberá validar la disponibilidad de los productos antes de confirmar el pedido.

El carrito podrá estar disponible para usuarios registrados y visitantes.

---

# 4.7 Autenticación y Creación de Cuenta

El visitante podrá crear una cuenta.

El registro podrá requerir:

- Nombre.
- Apellido.
- Correo electrónico.
- Número de teléfono.
- Tipo de identificación.
- Número de identificación, cuando aplique.
- Contraseña.

El sistema deberá validar el correo electrónico.

El cliente podrá iniciar sesión.

El cliente podrá cerrar sesión.

El cliente podrá restablecer su contraseña.

---

# 4.8 Compra como Invitado

El sistema permitirá realizar compras sin crear una cuenta.

El visitante deberá proporcionar la información necesaria para procesar el pedido.

La información podrá incluir:

- Nombre.
- Apellido.
- Número de teléfono.
- Correo electrónico.
- Dirección de entrega, cuando aplique.

El visitante podrá completar el proceso de compra sin registrarse.

---

# 4.9 Checkout

El proceso de checkout deberá permitir al cliente revisar la información de su pedido antes de confirmarlo.

El cliente podrá seleccionar:

- Tipo de pedido.
- Dirección de entrega.
- Agencia de recogida, cuando aplique.
- Método de pago.
- Código promocional.
- Puntos a utilizar.

El sistema deberá mostrar:

- Productos.
- Subtotal.
- Descuentos.
- Costo de entrega.
- Puntos utilizados.
- Total a pagar.

Antes de finalizar la compra, el cliente deberá confirmar los datos del pedido.

---

# 4.10 Tipos de Pedido

El cliente podrá seleccionar entre diferentes modalidades.

### Entrega a domicilio

El cliente deberá proporcionar o seleccionar una dirección de entrega.

El sistema determinará automáticamente la agencia responsable de atender la dirección.

El sistema deberá validar la disponibilidad de entrega en la zona.

### Recogida

El cliente podrá seleccionar la opción de recogida.

El sistema mostrará los puntos o agencias disponibles.

El cliente podrá seleccionar el punto donde desea recoger el pedido.

El sistema deberá informar al cliente cuando el pedido esté listo para ser recogido.

---

# 4.11 Acceso mediante Código QR

La plataforma permitirá generar códigos QR asociados a ubicaciones físicas dentro del complejo comercial.

El cliente podrá escanear el código QR utilizando su dispositivo móvil.

El código podrá dirigir a una versión específica y optimizada del sitio web.

La experiencia podrá identificar la ubicación desde la cual se realizó el acceso.

El sistema podrá utilizar esta información para:

- Seleccionar una agencia.
- Seleccionar una modalidad de recogida.
- Mostrar productos disponibles en una ubicación determinada.
- Aplicar configuraciones específicas para la ubicación.

La lógica definitiva asociada al código QR deberá ser definida durante la etapa de análisis funcional.

---

# 4.12 Códigos Promocionales

El cliente podrá ingresar un código promocional durante el proceso de compra.

El sistema deberá validar:

- Existencia del código.
- Estado.
- Fecha de vigencia.
- Condiciones de compra.
- Productos aplicables.
- Categorías aplicables.
- Marcas aplicables.
- Límite de usos.
- Límite por cliente.

Si el código es válido, el sistema deberá aplicar automáticamente el beneficio correspondiente.

El cliente podrá visualizar el descuento aplicado.

---

# 4.13 Puntos de Fidelización

El cliente registrado podrá visualizar su saldo de puntos.

El cliente podrá consultar su historial de puntos.

Durante el checkout, el cliente podrá utilizar puntos disponibles cuando cumpla las condiciones establecidas.

El sistema deberá mostrar claramente:

- Puntos disponibles.
- Puntos utilizados.
- Valor equivalente, cuando aplique.
- Puntos obtenidos con la compra.

El sistema deberá validar que el cliente no utilice más puntos de los disponibles.

---

# 4.14 Métodos de Pago

La plataforma deberá permitir diferentes métodos de pago.

Inicialmente se contemplan:

- Nequi.
- Tarjeta bancaria.
- Pago en efectivo.

La integración definitiva con los proveedores de pago deberá definirse durante la etapa técnica.

El sistema deberá registrar el estado del pago.

Los estados podrán incluir:

- Pendiente.
- Aprobado.
- Rechazado.
- Cancelado.
- Reembolsado.

El pedido no deberá marcarse como pagado hasta recibir una confirmación válida del método de pago correspondiente.

---

# 4.15 Confirmación del Pedido

Una vez completada la compra, el cliente podrá visualizar una página de confirmación.

La confirmación deberá mostrar:

- Número de pedido.
- Fecha.
- Productos.
- Total.
- Método de pago.
- Tipo de entrega.
- Dirección o agencia seleccionada.
- Estado inicial del pedido.

El sistema podrá enviar una confirmación por correo electrónico.

---

# 4.16 Historial de Pedidos

Los clientes registrados podrán consultar sus pedidos anteriores.

El cliente podrá visualizar:

- Número de pedido.
- Fecha.
- Total.
- Estado.
- Productos.
- Método de pago.
- Tipo de entrega.

El cliente podrá consultar el detalle de cada pedido.

---

# 4.17 Gestión de Perfil del Cliente

El cliente registrado podrá visualizar y actualizar su información.

Podrá administrar:

- Nombre.
- Apellido.
- Correo electrónico.
- Número de teléfono.
- Información de identificación.
- Contraseña.

El cliente podrá registrar múltiples direcciones de entrega.

El cliente podrá definir una dirección principal.

El cliente podrá editar o eliminar direcciones previamente registradas.

---

# 5. Experiencia de Usuario

La plataforma contará con una interfaz moderna, limpia y orientada al comercio electrónico.

El sitio público deberá estar diseñado bajo un enfoque **Mobile First**.

La experiencia deberá facilitar:

- Descubrimiento de productos.
- Búsqueda.
- Navegación por categorías.
- Compra rápida.
- Checkout sencillo.
- Consulta de pedidos.

El diseño deberá ser responsivo y adaptarse como mínimo a:

- Teléfonos móviles.
- Tablets.
- Computadores de escritorio.

El panel administrativo deberá priorizar la productividad del personal encargado de administrar la plataforma.

---

# 6. Seguridad

El sistema seguirá prácticas estándar de seguridad para proteger la plataforma, sus datos y el acceso de usuarios.

La implementación incluirá:

- Autenticación segura.
- Contraseñas almacenadas mediante algoritmos de hash seguros.
- Protección de rutas administrativas.
- Control de acceso basado en roles y permisos.
- Tokens de autenticación seguros.
- Protección de endpoints administrativos.
- HTTPS mediante certificados SSL.
- Variables de entorno para credenciales y configuraciones sensibles.
- Código fuente almacenado en un repositorio privado.
- Validación de información enviada por los usuarios.
- Protección contra accesos no autorizados.
- Limitación básica de solicitudes.
- Validación segura de archivos cargados.
- Restricción de tipos y tamaños de imágenes.
- Protección de las integraciones con sistemas externos.
- Registro de operaciones administrativas relevantes.

Las credenciales de servicios externos no deberán almacenarse directamente en el código fuente.

---

# 7. Protección de Información

La plataforma deberá manejar de forma segura la información personal de los clientes.

La información sensible deberá transmitirse mediante conexiones cifradas.

El acceso a información administrativa y de clientes deberá estar limitado según los permisos correspondientes.

El sistema deberá mantener registros de operaciones relevantes realizadas por administradores.

La implementación deberá considerar las obligaciones legales aplicables al tratamiento de datos personales en Colombia.

Las políticas de privacidad, tratamiento de datos personales, términos y condiciones y demás documentos legales deberán ser definidos y proporcionados por el cliente.

---

# 8. Rendimiento

La plataforma deberá estar optimizada para ofrecer una experiencia fluida, especialmente en dispositivos móviles.

La implementación incluirá:

- Enfoque Mobile First.
- Optimización de imágenes.
- Compresión de imágenes.
- Carga diferida de imágenes cuando corresponda.
- Caché de recursos estáticos.
- Respuestas eficientes de la API.
- Paginación en listados administrativos.
- Paginación o carga progresiva del catálogo.
- Optimización de consultas a la base de datos.
- Índices para búsquedas frecuentes.
- Optimización del proceso de búsqueda de productos.

Podrán implementarse mecanismos adicionales de caché utilizando Redis cuando el volumen de tráfico lo justifique.

---

# 9. Integraciones Externas

La plataforma deberá estar preparada para integrarse con sistemas externos.

Las integraciones contempladas incluyen:

### Sistema de inventario

Podrá realizarse mediante:

- API.
- CSV.

### Pasarela de pagos

La plataforma deberá poder integrarse con proveedores que permitan procesar:

- Tarjetas.
- Nequi.
- Otros métodos que sean definidos posteriormente.

### Servicios de mapas y geolocalización

Podrán utilizarse servicios externos para:

- Geocodificación.
- Validación de direcciones.
- Determinación de zonas.
- Ubicación de agencias.

La selección de proveedores específicos deberá definirse durante la fase técnica.

---

# 10. Notificaciones

El sistema podrá enviar notificaciones relacionadas con los pedidos.

Las notificaciones podrán enviarse mediante:

- Correo electrónico.
- SMS.
- WhatsApp.
- Otros canales que sean definidos posteriormente.

Las notificaciones podrán utilizarse para informar:

- Confirmación del pedido.
- Confirmación del pago.
- Pedido en preparación.
- Pedido listo para recoger.
- Pedido enviado.
- Pedido entregado.
- Cancelación del pedido.

La implementación de canales adicionales dependerá de las integraciones y proveedores seleccionados.

---

# 11. Auditoría y Trazabilidad

El sistema deberá registrar las operaciones administrativas relevantes.

Los registros podrán incluir:

- Usuario responsable.
- Fecha.
- Hora.
- Acción realizada.
- Registro afectado.
- Valores relevantes antes y después del cambio, cuando corresponda.

La auditoría podrá aplicarse especialmente a:

- Productos.
- Precios.
- Inventario.
- Pedidos.
- Clientes.
- Administradores.
- Roles.
- Promociones.
- Puntos de fidelización.

---

# 12. Tecnologías a Utilizar

El sistema será desarrollado utilizando una arquitectura moderna, robusta y mantenible.

**Lenguaje de programación:** TypeScript

**Frontend público:** Next.js + React

**Frontend administrativo:** Next.js + React

**Backend:** Node.js

**Base de datos:** MongoDB

**Caché:** Redis, cuando sea requerido

**Contenedores:** Docker

**Servidor:** VPS

**Almacenamiento de archivos:** AWS S3 o servicio compatible con S3

**Control de código fuente:** Git + GitHub

**CI/CD:** GitHub Actions o herramienta equivalente

**Autenticación:** Sistema basado en tokens/sesiones seguras

**API:** REST API

---

# 13. Arquitectura General

La solución estará compuesta por:

### Aplicación Web Pública

Responsable de:

- Catálogo.
- Búsqueda.
- Categorías.
- Productos.
- Carrito.
- Checkout.
- Autenticación de clientes.
- Cuenta del cliente.
- Pedidos.
- Promociones.
- Puntos.
- Acceso mediante QR.

### Panel Administrativo

Responsable de:

- Administración de usuarios.
- Roles y permisos.
- Catálogo.
- Productos.
- Categorías.
- Marcas.
- Inventario.
- Pedidos.
- Agencias.
- Promociones.
- Banners.
- Secciones destacadas.
- Clientes.
- Fidelización.
- Integraciones.

### Backend / API

Responsable de:

- Autenticación.
- Autorización.
- Gestión de usuarios.
- Catálogo.
- Inventario.
- Pedidos.
- Pagos.
- Promociones.
- Fidelización.
- Agencias.
- Integraciones externas.

### Base de Datos

La base de datos almacenará la información relacionada con:

- Usuarios.
- Administradores.
- Roles.
- Permisos.
- Clientes.
- Categorías.
- Marcas.
- Productos.
- Inventario.
- Agencias.
- Pedidos.
- Detalles de pedidos.
- Pagos.
- Códigos promocionales.
- Puntos.
- Banners.
- Secciones destacadas.

---

# 14. Consideraciones Funcionales Pendientes de Definición

Antes de iniciar el desarrollo deberán definirse con el cliente algunos aspectos que pueden afectar considerablemente la arquitectura y el alcance del proyecto.

Entre ellos:

1. Sistema actual utilizado para administrar productos e inventario.
2. Disponibilidad de API del sistema actual.
3. Formato definitivo del CSV de inventario.
4. Frecuencia requerida para sincronizar inventario.
5. Si los precios también serán sincronizados desde el sistema externo.
6. Si el inventario será manejado globalmente o por agencia.
7. Reglas exactas para la asignación automática de agencia.
8. Cobertura geográfica de cada agencia.
9. Reglas de cálculo de costos de domicilio.
10. Reglas de acumulación de puntos.
11. Valor monetario de los puntos.
12. Reglas para utilizar puntos.
13. Reglas de expiración de puntos.
14. Reglas de códigos promocionales.
15. Proveedor de pagos para tarjetas.
16. Proveedor de integración con Nequi.
17. Flujo exacto para pagos en efectivo.
18. Estados definitivos de los pedidos.
19. Flujo de cancelaciones y reembolsos.
20. Política de cambios y devoluciones.
21. Manejo de productos con restricciones especiales.
22. Manejo de productos que requieran fórmula o validación adicional, si aplica.
23. Información legal que deberá mostrarse en los productos.
24. Necesidad de facturación electrónica.
25. Integración con el sistema de facturación existente.
26. Proveedor de mapas/geolocalización.
27. Reglas específicas para pedidos realizados mediante QR.
28. Información que deberá conservarse para clientes invitados.
29. Canales de notificación requeridos.
30. Políticas de tratamiento de datos y términos y condiciones.

---

# 15. Funcionalidades Adicionales Recomendadas

Como parte de una segunda fase o como funcionalidades opcionales, se podrán considerar:

- Favoritos.
- Lista de deseos.
- Recompra rápida.
- Productos recientemente vistos.
- Recomendaciones personalizadas.
- Valoraciones y reseñas de productos.
- Notificaciones de reposición de inventario.
- Alertas de promociones.
- Seguimiento de pedidos.
- Dashboard de métricas administrativas.
- Reportes de ventas.
- Reportes de productos más vendidos.
- Reportes de clientes.
- Reportes de uso de promociones.
- Reportes de puntos.
- Exportación de información a CSV/Excel.
- Gestión de horarios de atención por agencia.
- Configuración de costos de envío.
- Configuración de zonas de cobertura.
- Integración con servicios de mensajería.
- Integración con WhatsApp.
- Sistema de cupones avanzados.
- Programación automática de banners.
- SEO para categorías, marcas y productos.
- Sitemap y metadata dinámica.
- Analytics y métricas de conversión.

---

# 16. Criterios Generales de Aceptación

La plataforma deberá permitir a un visitante navegar por el catálogo sin necesidad de crear una cuenta.

Un cliente deberá poder crear una cuenta e iniciar sesión.

Un cliente deberá poder realizar una compra como visitante.

Un cliente deberá poder realizar una compra como usuario registrado.

Un cliente deberá poder agregar productos al carrito y modificar sus cantidades.

El sistema deberá validar la disponibilidad de los productos antes de confirmar el pedido.

El cliente deberá poder seleccionar entrega o recogida.

El sistema deberá poder determinar la agencia correspondiente según la dirección de entrega.

El cliente deberá poder aplicar códigos promocionales válidos.

El cliente registrado deberá poder utilizar puntos de fidelización cuando cumpla las condiciones configuradas.

El sistema deberá registrar correctamente el estado del pago.

El sistema deberá registrar correctamente el estado del pedido.

El administrador deberá poder gestionar el catálogo completo desde el panel administrativo.

El administrador deberá poder administrar categorías con tres niveles jerárquicos.

El administrador deberá poder administrar marcas.

El administrador deberá poder administrar productos.

El administrador deberá poder administrar banners y secciones destacadas.

El administrador deberá poder administrar clientes.

El administrador deberá poder administrar agencias.

El administrador deberá poder administrar promociones y códigos promocionales.

El administrador deberá poder consultar y gestionar pedidos.

El sistema deberá permitir la actualización del inventario mediante API o CSV.

El sistema deberá aplicar controles de autenticación y autorización adecuados para proteger las funcionalidades administrativas.

---

# 17. Alcance del Proyecto

El alcance inicial contempla el desarrollo de:

**1. Sitio web público de e-commerce**

**2. Panel administrativo**

**3. Backend/API**

**4. Base de datos**

**5. Gestión de catálogo**

**6. Gestión de clientes**

**7. Gestión de pedidos**

**8. Gestión de agencias**

**9. Sistema de promociones**

**10. Sistema de puntos**

**11. Checkout**

**12. Integración de pagos**

**13. Integración de inventario**

**14. Sistema de acceso mediante QR**

**15. Infraestructura de despliegue**

**16. Seguridad y control de acceso**

**17. Sistema básico de auditoría**

Las funcionalidades adicionales, integraciones específicas y reglas de negocio que dependan de sistemas externos deberán ser validadas con el cliente antes de estimar su esfuerzo de desarrollo.

---

# 18. Consideración Final

El presente documento constituye una definición funcional inicial del sistema y deberá ser revisado conjuntamente con el cliente antes de comenzar el desarrollo.

Las reglas de negocio relacionadas con inventario, agencias, pagos, puntos, promociones, domicilios, facturación y sistemas externos deberán ser confirmadas durante la etapa de análisis para evitar ambigüedades durante la implementación.

Cualquier funcionalidad que no se encuentre explícitamente definida dentro del presente documento deberá considerarse fuera del alcance inicial hasta que sea analizada, estimada y aprobada.
