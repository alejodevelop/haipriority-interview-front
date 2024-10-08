# Haipriority Frontend

Este es el frontend del proyecto Haipriority, una aplicación web desarrollada con Angular v18 que permite gestionar tarjetas de crédito, tarjetas de débito y préstamos. La aplicación proporciona una interfaz intuitiva para visualizar y administrar las finanzas personales.

## Descripción

La aplicación Haipriority Frontend permite a los usuarios:

- Visualizar estadísticas financieras en gráficos.
- Crear, eliminar y actualizar tarjetas de débito y crédito.
- Pagar deudas de tarjetas de crédito.
- Realizar pagos con tarjetas de crédito y débito.
- Depositar dinero en tarjetas de débito.
- Pagar préstamos.

## Páginas

### Dashboard

En la página del dashboard, los usuarios pueden ver un resumen de sus finanzas, incluyendo el total de dinero en tarjetas de débito, la deuda en tarjetas de crédito y la deuda en préstamos. Estos datos se presentan en gráficos de pastel y de barras.

### Tarjetas de Débito

En esta página, los usuarios pueden ver una lista de sus tarjetas de débito, crearlas, eliminarlas y actualizar su nombre.

### Tarjetas de Crédito

En esta página, los usuarios pueden ver una lista de sus tarjetas de crédito, crearlas, eliminarlas y actualizar su nombre.

### Préstamos

En esta página, los usuarios pueden ver una lista de sus préstamos, eliminarlos y pagar las deudas de los préstamos.

### Pagos

En esta página, los usuarios pueden realizar pagos con tarjetas de crédito y débito.

## Requisitos

- Node.js
- npm

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/alejodevelop/haipriority-front.git
    cd haipriority-front
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
npm start
ng serve
