# pruebaTRD
Prueba técnica de tracered


Para iniciar la aplicación se usa el siguiente comando: npm run dev

El flujo de la aplicación es el siguiente:

	1.- Se agrega un usuario con los siguientes campos: 
		(
			name: string, 
			email: string, 
			password: string
		)
	
	
	2.- Se hace login con el email y la contraseña (el email es único para cada usuario)
	
	3.- Se crean tareas que quedan asociadas al usuario con lo siguientes campos:
		(
			id_usuario: string,
			titulo: string,
			descripcion:string,
			fecha_limite: date,
			estado:string ("PENDIENTE" | "COMPLETADA),
			categoria: string ("TRABAJO" | "PERSONAL", "ESTUDIO")
		)
	4.- Listar todas las tareas del usuario (se envía el id del usuario en las query params)
  
  5.- Tarea detallada (Se envía el id de la tarea y del usuario en las query params)
  
  6.- Actualizar tarea (Se envía el id de la tarea en el query params y en el body se mandan los datos a actualizar)
  
  7.- Eliminar tarea (Se envía el id de la tarea)
  
  8.- Añadir archivo (Se envía el archivo en el body y en los query params se envían el id de la tarea y el usuario)

  9.- Descargar archivo (Se envía el id del archivo, tarea y usuario en las query params)

  10.- Eliminar archivo (Se envía el id del archivo, tarea y usuario en las query params)

  11.- Filtrado por estado (Se envía el filtro: "COMPLETADA" || "PENDIENTE y el id del usuario en las query params)

  12.- Filtrado por categoría (Se envía el filtro: "TRABAJO" || "ESTUDIO" || "PERSONAL" y el id del usuario en las query params)
