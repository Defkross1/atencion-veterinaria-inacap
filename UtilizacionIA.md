**Uso de Inteligencia Artificial**


***¿Qué herramienta utilizó?***

Utilicé Gemini para refinar la estructura, mejorar los estilos responsivos y depurar la interactividad de la aplicación.

----------------------------------------------------
***¿Qué consulta realizó?***

¿Cómo puedo re-renderizar de forma óptima un arreglo de objetos dinámicos en una tabla HTML utilizando la API del DOM nativa de JavaScript, garantizando que los filtros rápidos y el ordenamiento sigan aplicándose correctamente después de modificar o eliminar un elemento en memoria?

----------------------------------------------------
***¿Qué sugerencia entregó la IA?***

La IA recomendó separar las fuentes de datos. Sugirió mantener un único arreglo global que contenga los objetos como el estado de la aplicación, y tener una función mostrarMascotas dedicada exclusivamente a aplicar los tres filtros dinámicos (búsqueda, estado y orden) en secuencia cada vez que sea llamada, renderizando los nuevos nodos en el DOM de forma limpia.

----------------------------------------------------
***¿La utilizó completamente o realizó modificaciones?***

Realicé modificaciones estructurales importantes. El código sugerido por la IA utilizaba alertas (alert()) y confirmaciones nativas del navegador (confirm()) para validar los formularios y confirmar la eliminación de mascotas. Modifiqué la solución por completo creando dos estructuras de modales estilizados con CSS en el HTML y controlando su visibilidad mediante Javascript para no entorpecer la experiencia del usuario y cumplir fielmente con la rúbrica del examen.

----------------------------------------------------
***¿Por qué considera importante revisar las respuestas generadas por la IA antes de utilizarlas?***

Es fundamental porque las inteligencias artificiales entregan respuestas generalizadas sin conocer con detalle las restricciones específicas de nuestra evaluación académica (como no utilizar alertas del sistema). Al revisar, auditar y adaptar el código, aseguramos que la solución sea 100% compatible con los requerimientos de Inacap, que no existan fallas de lógica o de seguridad, y que podamos defender y comprender con claridad cada bloque de código que entregamos.