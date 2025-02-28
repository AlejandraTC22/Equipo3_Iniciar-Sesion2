# Equipo3_Iniciar-Sesion2
Corrección de las vulnerabilidades que tenia el código
Contraseña segura : Ahora se valida que las contraseñas sean fuertes antes de registrarse.
Cifrado de contraseñas : Se cifran las contraseñas antes de almacenarlas.
Protección contra ataques de fuerza bruta : Se implementa un mecanismo de bloqueo de cuenta tras varios intentos fallidos.
Prevención de XSS : Se sanitizan los mensajes de los usuarios para prevenir ataques de inyección de scripts.
Mejor gestión de los usuarios : Se añaden campos como loginAttemptsy blockedUntilpara gestionar los intentos de inicio de sesión y el bloqueo de cuentas.
