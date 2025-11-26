# DOCUMENTACIÓN - FITBOT



### Descripción del Proyecto

**FitBot** es un chatbot inteligente diseñado como asistente personal de entrenamiento y fitness. La aplicación web utiliza inteligencia artificial para proporcionar rutinas de ejercicio personalizadas, consejos de técnica deportiva y seguimiento de progreso en tiempo real.

El chatbot está desarrollado como una aplicación React moderna que integra la API de Cohere para generar respuestas contextuales y adaptadas al perfil de cada usuario. FitBot permite a usuarios de todos los niveles (principiantes, intermedios y avanzados) recibir orientación especializada según sus objetivos específicos: perder peso, ganar masa muscular, mejorar la resistencia o mantener un estilo de vida activo.

La aplicación cuenta con una interfaz intuitiva que facilita la interacción mediante chat, permitiendo a los usuarios solicitar rutinas, obtener instrucciones detalladas de ejercicios, marcar su progreso y visualizar estadísticas de su actividad física.

###  Objetivos

#### Objetivo General
Desarrollar un chatbot inteligente que funcione como asistente personal de entrenamiento, proporcionando rutinas de ejercicio personalizadas y seguimiento de progreso mediante el uso de inteligencia artificial.

#### Objetivos Específicos
- Implementar un sistema de chat interactivo que permita comunicación natural con el usuario
- Integrar la API de Cohere para generar respuestas contextuales sobre fitness y entrenamiento
- Desarrollar un sistema de perfiles de usuario que almacene información sobre nivel de experiencia y objetivos
- Crear un módulo de generación automática de rutinas de ejercicios personalizadas
- Implementar un sistema de seguimiento de progreso con marcado de ejercicios completados
- Desarrollar un panel de estadísticas que visualice métricas de actividad del usuario
- Proporcionar instrucciones detalladas paso a paso para la ejecución correcta de ejercicios
- Diseñar una interfaz de usuario moderna, responsiva e intuitiva

---

##  Requisitos

###  Requisitos Funcionales

1. **RF-01: Autenticación y Perfil de Usuario**
   - El sistema debe permitir al usuario registrarse proporcionando nombre, nivel de experiencia y objetivos
   - El sistema debe almacenar y recuperar el perfil del usuario durante la sesión

2. **RF-02: Configuración de API Key**
   - El sistema debe solicitar y validar la API Key de Cohere al iniciar la aplicación
   - El sistema debe almacenar la API Key de forma segura durante la sesión

3. **RF-03: Chat Interactivo**
   - El sistema debe permitir al usuario enviar mensajes de texto
   - El sistema debe procesar los mensajes y generar respuestas contextuales mediante la API de Cohere
   - El sistema debe mantener el historial de conversación durante la sesión

4. **RF-04: Generación de Rutinas**
   - El sistema debe generar rutinas de ejercicios personalizadas basadas en el perfil del usuario
   - Las rutinas deben incluir nombre del ejercicio, número de series y repeticiones
   - El sistema debe detectar automáticamente cuando una respuesta contiene una rutina de ejercicios

5. **RF-05: Seguimiento de Ejercicios**
   - El sistema debe permitir marcar ejercicios como completados
   - El sistema debe actualizar las estadísticas en tiempo real al completar ejercicios
   - El sistema debe visualizar el estado de completitud de cada ejercicio

6. **RF-06: Instrucciones de Ejercicios**
   - El sistema debe proporcionar instrucciones paso a paso para realizar ejercicios específicos
   - Las instrucciones deben generarse dinámicamente mediante la API de Cohere
   - El sistema debe mostrar las instrucciones en un modal interactivo

7. **RF-07: Panel de Estadísticas**
   - El sistema debe mostrar el número total de rutinas creadas
   - El sistema debe mostrar el número de ejercicios completados
   - El sistema debe mostrar el número de días activos
   - El sistema debe mostrar una barra de progreso diario con meta de 10 ejercicios

8. **RF-08: Acciones Rápidas**
   - El sistema debe proporcionar botones de acción rápida para solicitar rutinas y consejos
   - Las acciones rápidas deben pre-llenar el campo de entrada con mensajes comunes

### 3.2. Requisitos No Funcionales

1. **RNF-01: Rendimiento**
   - La aplicación debe cargar en menos de 3 segundos
   - Las respuestas del chatbot deben generarse en menos de 5 segundos
   - La interfaz debe ser fluida con animaciones suaves (60 FPS)

2. **RNF-02: Usabilidad**
   - La interfaz debe ser intuitiva y fácil de usar sin necesidad de capacitación
   - El diseño debe ser responsivo y funcionar en dispositivos móviles y de escritorio
   - Los mensajes de error deben ser claros y orientativos

3. **RNF-03: Seguridad**
   - La API Key debe almacenarse solo en memoria durante la sesión
   - No se debe almacenar información sensible de forma persistente sin encriptación
   - Las comunicaciones con la API deben realizarse mediante HTTPS

4. **RNF-04: Compatibilidad**
   - La aplicación debe funcionar en los navegadores modernos (Chrome, Firefox, Safari, Edge)
   - Debe ser compatible con Node.js versión 16 o superior

5. **RNF-05: Mantenibilidad**
   - El código debe estar bien estructurado y comentado
   - Debe seguir las mejores prácticas de React y JavaScript
   - Debe utilizar herramientas de linting para mantener calidad de código

---



###  Componentes Principales

- **Frontend (React)**: Interfaz de usuario construida con React, utilizando hooks para gestión de estado
- **API Externa (Cohere)**: Servicio de IA que procesa las solicitudes del usuario y genera respuestas contextuales
- **Almacenamiento Local**: Estado de la aplicación mantenido en memoria durante la sesión (no persistente)

---

## 5. Tecnologías Utilizadas

### Lenguajes de Programación

- **JavaScript (ES6+)**: Lenguaje principal para el desarrollo de la aplicación
- **JSX**: Extensión de sintaxis de JavaScript para la creación de componentes React
- **CSS**: Estilos mediante Tailwind CSS (utility-first CSS framework)

### Frameworks y Librerías

#### Frontend
- **React 19.2.0**: Biblioteca de JavaScript para construir interfaces de usuario
- **React DOM 19.2.0**: Renderizador de React para el navegador
- **Vite 7.2.2**: Herramienta de construcción y servidor de desarrollo de alta velocidad
- **Tailwind CSS 3.4.1**: Framework de CSS utility-first para diseño rápido
- **Lucide React 0.553.0**: Biblioteca de iconos SVG para React
- **Recharts 3.4.1**: Biblioteca de gráficos para React (importada pero no utilizada actualmente)

#### Backend/Utilidades
- **Express 5.1.0**: Framework web para Node.js (si se implementa backend)
- **CORS 2.8.5**: Middleware para habilitar CORS

#### Desarrollo
- **ESLint 9.39.1**: Herramienta de linting para mantener calidad de código
- **PostCSS 8.4.35**: Herramienta para transformar CSS
- **Autoprefixer 10.4.17**: Plugin de PostCSS para agregar prefijos de navegadores
- **Concurrently 9.1.2**: Ejecutar múltiples comandos simultáneamente

### Plataformas y Servicios

- **Cohere API**: Plataforma de inteligencia artificial para procesamiento de lenguaje natural
  - Modelo utilizado: `command-r7b-12-2024`
  - Endpoint: `https://api.cohere.com/v1/chat`
- **Node.js**: Entorno de ejecución de JavaScript
- **npm**: Gestor de paquetes de Node.js

---

##  Implementación

###  Guía de Instalación

#### Requisitos Previos
- Node.js versión 16 o superior
- npm (incluido con Node.js) o yarn
- API Key de Cohere (obtener gratuitamente en [Cohere Dashboard](https://dashboard.cohere.com/api-keys))
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

#### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si el proyecto está en un repositorio Git
   git clone [url-del-repositorio]
   cd fitbot-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```
   Este comando instalará todas las dependencias listadas en `package.json`.

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173` (puerto por defecto de Vite).

4. **Configurar API Key**
   - Al abrir la aplicación en el navegador, aparecerá un modal solicitando la API Key de Cohere
   - Ingresar la API Key obtenida del dashboard de Cohere
   - La clave se almacenará en memoria durante la sesión

5. **Construir para producción** (opcional)
   ```bash
   npm run build
   ```
   Los archivos optimizados se generarán en la carpeta `dist/`.

### 6.2. Explicación del Código

#### Estructura Principal (`App.jsx`)

**Estados Principales:**
```javascript
const [messages, setMessages] = useState([]);           // Historial de mensajes del chat
const [user, setUser] = useState(null);                 // Perfil del usuario
const [workouts, setWorkouts] = useState([]);           // Rutinas generadas
const [progress, setProgress] = useState([]);           // Progreso del usuario
const [completedExercises, setCompletedExercises] = useState(new Set()); // Ejercicios completados
const [apiKey, setApiKey] = useState('');               // API Key de Cohere
```

**Función de Envío de Mensajes (`handleSend`):**
- Valida que exista API Key y mensaje
- Construye el historial de chat en formato requerido por Cohere
- Genera un prompt del sistema personalizado según el perfil del usuario
- Realiza petición POST a la API de Cohere
- Procesa la respuesta y actualiza el estado de mensajes
- Detecta automáticamente si la respuesta contiene una rutina de ejercicios

**Detección de Ejercicios (`renderMessage`):**
- Analiza cada línea del mensaje del asistente
- Identifica ejercicios mediante expresiones regulares (formato `**Ejercicio** - series x repeticiones`)
- Renderiza ejercicios como componentes interactivos con botones de completado
- Permite marcar/desmarcar ejercicios como completados

**Generación de Instrucciones (`fetchExerciseInstructions`):**
- Solicita a la API de Cohere instrucciones específicas para un ejercicio
- Utiliza un prompt optimizado para generar pasos cortos y numerados
- Muestra las instrucciones en un modal interactivo

**Seguimiento de Progreso (`completeExercise`):**
- Actualiza el estado de ejercicios completados
- Calcula estadísticas diarias de progreso
- Persiste el progreso en el estado de la aplicación

#### Flujo de Datos

1. Usuario envía mensaje → `handleSend()`
2. Mensaje se agrega al historial → `setMessages()`
3. Petición a Cohere API con historial y prompt del sistema
4. Respuesta procesada y agregada al historial
5. Si la respuesta contiene ejercicios → se agregan a `workouts`
6. Usuario marca ejercicio → `completeExercise()` → actualiza `progress`

---



###  Manual de Usuario

#### Inicio de Sesión

1. Abrir la aplicación en el navegador
2. Se mostrará un modal solicitando la API Key de Cohere
3. Ingresar la API Key obtenida de [Cohere Dashboard](https://dashboard.cohere.com/api-keys)
4. Hacer clic en "Guardar"

#### Registro de Perfil

1. Al iniciar, el chatbot solicitará información personal:
   - **Nombre**: Tu nombre o apodo
   - **Nivel**: Principiante, Intermedio o Avanzado
   - **Objetivos**: Perder peso, ganar músculo, mejorar resistencia, etc.

2. Ejemplo de respuesta:
   ```
   Me llamo Juan, soy principiante y quiero perder peso
   ```

#### Solicitar Rutinas de Ejercicio

1. Escribir en el chat mensajes como:
   - "Genera rutina para hoy"
   - "Necesito una rutina de pecho"
   - "Rutina para piernas"

2. El chatbot generará una rutina personalizada con ejercicios, series y repeticiones

3. Los ejercicios aparecerán como tarjetas interactivas con:
   - Checkbox para marcar como completado
   - Botón "Ver demo" para instrucciones

#### Completar Ejercicios

1. Realizar el ejercicio según las indicaciones
2. Hacer clic en el checkbox junto al ejercicio para marcarlo como completado
3. El ejercicio se marcará en verde y se tachará
4. El progreso se actualizará automáticamente

#### Ver Instrucciones de Ejercicios

1. Hacer clic en el botón "Ver demo" de cualquier ejercicio
2. Se abrirá un modal con instrucciones paso a paso
3. Leer las instrucciones para realizar el ejercicio correctamente
4. Hacer clic en "¡Entendido!" para cerrar el modal

#### Consultar Estadísticas

1. Hacer clic en el icono de gráfico (📊) en la barra superior
2. Se mostrará el panel de estadísticas con:
   - Número total de rutinas creadas
   - Número de ejercicios completados
   - Número de días activos
   - Barra de progreso diario (meta: 10 ejercicios)

#### Ver Perfil

1. Hacer clic en el icono de usuario (👤) en la barra superior
2. Se mostrará el panel lateral con:
   - Nombre del usuario
   - Nivel de experiencia
   - Objetivo de entrenamiento
   - Total de ejercicios completados

#### Acciones Rápidas

En la parte inferior del chat hay botones de acción rápida:
- **🏋️ Rutina**: Solicita automáticamente una rutina para hoy
- **💡 Consejos**: Solicita consejos de técnica

#### Consejos de Uso

- Sé específico en tus solicitudes para obtener mejores resultados
- Marca los ejercicios como completados para mantener un registro preciso
- Revisa las instrucciones antes de realizar ejercicios nuevos
- Consulta tus estadísticas regularmente para motivarte
- El chatbot está diseñado para responder solo sobre fitness y entrenamiento

---

##  Referencias

###  Bibliografía

1. React Documentation. (2024). *React - A JavaScript library for building user interfaces*. https://react.dev/

2. Cohere Documentation. (2024). *Cohere API Reference*. https://docs.cohere.com/

3. Vite Documentation. (2024). *Vite - Next Generation Frontend Tooling*. https://vitejs.dev/

4. Tailwind CSS Documentation. (2024). *Tailwind CSS - Rapidly build modern websites*. https://tailwindcss.com/

5. JavaScript MDN Web Docs. (2024). *JavaScript - MDN*. https://developer.mozilla.org/en-US/docs/Web/JavaScript

### 8.2. Enlaces a Recursos

- **Cohere Dashboard**: https://dashboard.cohere.com/api-keys
- **Cohere API Documentation**: https://docs.cohere.com/reference/chat
- **React Documentation**: https://react.dev/learn
- **Vite Guide**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/
- **Node.js**: https://nodejs.org/
- **npm Documentation**: https://docs.npmjs.com/



## Conclusión

Esta documentación proporciona una visión completa del proyecto FitBot, desde su concepción hasta su implementación. El chatbot demuestra la integración exitosa de tecnologías modernas de desarrollo web con servicios de inteligencia artificial para crear una herramienta útil y accesible para el entrenamiento personal.

La documentación técnica es fundamental en el desarrollo de software, ya que facilita el mantenimiento, la colaboración y la comprensión del sistema tanto para desarrolladores como para usuarios finales.
