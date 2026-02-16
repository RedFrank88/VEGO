export const translations = {
  es: {
    // Auth - Welcome
    auth_welcome_subtitle: "Encontrá cargadores para tu vehículo eléctrico en Uruguay",
    auth_start: "Comenzar",
    auth_have_account: "Ya tengo cuenta",

    // Auth - Login
    auth_login_title: "Iniciar Sesión",
    auth_login_subtitle: "Bienvenido de vuelta a VEGO",
    auth_email: "Email",
    auth_password: "Contraseña",
    auth_logging_in: "Ingresando...",
    auth_login: "Ingresar",
    auth_login_failed: "No se pudo iniciar sesión",

    // Auth - Register
    auth_register_title: "Crear Cuenta",
    auth_register_subtitle: "Únete a la comunidad VEGO",
    auth_name: "Nombre",
    auth_password_hint: "Contraseña (mín. 6 caracteres)",
    auth_registering: "Creando cuenta...",
    auth_register: "Registrarse",
    auth_has_account: "¿Ya tenés cuenta? Iniciá sesión",
    auth_password_min: "La contraseña debe tener al menos 6 caracteres",
    auth_register_failed: "No se pudo crear la cuenta",

    // Auth - Common
    auth_fill_all_fields: "Completá todos los campos",

    // Common
    error: "Error",
    cancel: "Cancelar",
    coming_soon: "Próximamente",
    coming_soon_message: "Esta función estará disponible pronto",
    user_default: "Usuario",
    anonymous: "Anónimo",

    // Tabs
    tabs_map: "Mapa",
    tabs_favorites: "Favoritos",
    tabs_profile: "Perfil",
    tabs_header_map: "VEGO",
    tabs_header_favorites: "Favoritos",
    tabs_header_profile: "Mi Perfil",

    // Station status
    station_available: "Disponible",
    station_occupied: "Ocupado",
    station_broken: "Fuera de servicio",
    station_broken_short: "Averiado",

    // Map
    map_no_chargers: "No hay cargadores disponibles en este momento",
    map_info: "Info",
    map_nearest: "Más cercano",
    map_search_placeholder: "Buscar estación...",
    map_station_count_one: "estación",
    map_station_count_other: "estaciones",
    map_filter_all: "Todos",

    // Favorites
    favorites_empty_title: "Sin favoritos",
    favorites_empty_subtitle: "Guardá tus cargadores favoritos para acceder rápidamente",

    // Profile
    profile_favorites: "Favoritos",
    profile_eco_points: "Eco-puntos",
    profile_checkins: "Check-ins",
    profile_notifications: "Notificaciones",
    profile_settings: "Configuración",
    profile_help: "Ayuda",
    profile_logout: "Cerrar Sesión",
    profile_logout_confirm: "¿Estás seguro?",

    // Station Detail
    station_not_found: "Estación no encontrada",
    station_connectors: "Conectores",
    station_power: "Potencia",
    station_connector: "Conector",
    station_operator: "Operador",
    station_last_report: "Último reporte",
    station_report_by: "Por",
    station_report_status: "Estado",
    station_report_connector: "Conector",
    station_report_time: "Hace",
    station_report_duration: "Duración est.",
    station_directions: "Cómo llegar",
    station_report_location: "Reportar ubicación incorrecta",
    station_release_connector: "Liberar conector",
    station_checkin: "Hacer Check-in",
    station_checkin_approach: "Acercate para Check-in",
    station_distance_from_you: "A {distance} de tu ubicación",
    station_free_connectors: "libres",

    // Check-in
    checkin_title: "Check-in",
    checkin_charger_status: "Estado del cargador",
    checkin_occupied_label: "Ocupado (estoy cargando)",
    checkin_connector_available: "¿Qué conector volvió a funcionar?",
    checkin_connector_occupied: "¿En qué conector estás cargando?",
    checkin_connector_broken: "¿Qué conector está averiado?",
    checkin_no_connectors: "No hay conectores disponibles en este momento",
    checkin_estimated_time: "Tiempo estimado de carga",
    checkin_confirm: "Confirmar Check-in",
    checkin_success_title: "Check-in exitoso",
    checkin_success_message: "Gracias por reportar el estado del cargador",
    checkin_failed: "No se pudo realizar el check-in",
    checkin_login_required: "Necesitás iniciar sesión para hacer check-in",
    checkin_too_far_title: "Estás lejos",
    checkin_too_far_message: "Necesitás estar a menos de 300 metros de la estación para hacer check-in.",

    // Release
    release_success_title: "Conector liberado",
    release_success_message: "El conector fue marcado como disponible",
    release_failed: "No se pudo liberar el conector",

    // Report
    report_login_required: "Necesitás iniciar sesión para reportar",
    report_empty_text: "Describí dónde está realmente la estación",
    report_title: "Reportar ubicación",
    report_subtitle: "¿La estación no está donde indica el mapa? Describí dónde se encuentra realmente.",
    report_placeholder: "Ej: Está en la esquina opuesta, sobre la vereda norte...",
    report_hint: "Tu ubicación actual se enviará como referencia.",
    report_submit: "Enviar reporte",
    report_success_title: "Reporte enviado",
    report_success_message: "Gracias por ayudar a corregir la ubicación. Lo revisaremos pronto.",
    report_failed: "No se pudo enviar el reporte",

    // Notifications
    notification_still_charging: "¿Seguís cargando?",
    notification_time_up: "Tu tiempo en {station} terminó. El conector se liberará en 3 minutos.",

    // Settings
    settings_title: "Configuración",
    settings_distance_unit: "Unidad de distancia",
    settings_km: "Kilómetros (km)",
    settings_mi: "Millas (mi)",
    settings_language: "Idioma",
    settings_info: "Información",
    settings_version: "Versión",

    // Settings - Avatar
    settings_map_avatar: "Avatar en el mapa",
    settings_avatar_default: "Punto azul (por defecto)",
    settings_avatar_cars: "Autos",
    settings_avatar_animals: "Animalitos",

    // Settings - Delete Account
    settings_delete_account: "Borrar cuenta",
    settings_delete_confirm_title: "¿Borrar tu cuenta?",
    settings_delete_confirm_message: "Esta acción es irreversible. Se eliminarán todos tus datos, check-ins y favoritos.",
    settings_delete_enter_password: "Ingresá tu contraseña para confirmar",
    settings_delete_password_placeholder: "Contraseña",
    settings_delete_success: "Cuenta eliminada correctamente",
    settings_delete_failed: "No se pudo borrar la cuenta",
    settings_delete_button: "Borrar mi cuenta",

    // Location
    location_permission_denied: "Permiso de ubicación denegado",
  },

  en: {
    // Auth - Welcome
    auth_welcome_subtitle: "Find chargers for your electric vehicle in Uruguay",
    auth_start: "Get Started",
    auth_have_account: "I already have an account",

    // Auth - Login
    auth_login_title: "Log In",
    auth_login_subtitle: "Welcome back to VEGO",
    auth_email: "Email",
    auth_password: "Password",
    auth_logging_in: "Logging in...",
    auth_login: "Log In",
    auth_login_failed: "Could not log in",

    // Auth - Register
    auth_register_title: "Create Account",
    auth_register_subtitle: "Join the VEGO community",
    auth_name: "Name",
    auth_password_hint: "Password (min. 6 characters)",
    auth_registering: "Creating account...",
    auth_register: "Sign Up",
    auth_has_account: "Already have an account? Log in",
    auth_password_min: "Password must be at least 6 characters",
    auth_register_failed: "Could not create account",

    // Auth - Common
    auth_fill_all_fields: "Please fill in all fields",

    // Common
    error: "Error",
    cancel: "Cancel",
    coming_soon: "Coming Soon",
    coming_soon_message: "This feature will be available soon",
    user_default: "User",
    anonymous: "Anonymous",

    // Tabs
    tabs_map: "Map",
    tabs_favorites: "Favorites",
    tabs_profile: "Profile",
    tabs_header_map: "VEGO",
    tabs_header_favorites: "Favorites",
    tabs_header_profile: "My Profile",

    // Station status
    station_available: "Available",
    station_occupied: "Occupied",
    station_broken: "Out of service",
    station_broken_short: "Broken",

    // Map
    map_no_chargers: "No chargers available at the moment",
    map_info: "Info",
    map_nearest: "Nearest",
    map_search_placeholder: "Search station...",
    map_station_count_one: "station",
    map_station_count_other: "stations",
    map_filter_all: "All",

    // Favorites
    favorites_empty_title: "No favorites",
    favorites_empty_subtitle: "Save your favorite chargers for quick access",

    // Profile
    profile_favorites: "Favorites",
    profile_eco_points: "Eco-points",
    profile_checkins: "Check-ins",
    profile_notifications: "Notifications",
    profile_settings: "Settings",
    profile_help: "Help",
    profile_logout: "Log Out",
    profile_logout_confirm: "Are you sure?",

    // Station Detail
    station_not_found: "Station not found",
    station_connectors: "Connectors",
    station_power: "Power",
    station_connector: "Connector",
    station_operator: "Operator",
    station_last_report: "Last report",
    station_report_by: "By",
    station_report_status: "Status",
    station_report_connector: "Connector",
    station_report_time: "Ago",
    station_report_duration: "Est. duration",
    station_directions: "Get directions",
    station_report_location: "Report incorrect location",
    station_release_connector: "Release connector",
    station_checkin: "Check In",
    station_checkin_approach: "Get closer to Check In",
    station_distance_from_you: "{distance} from your location",
    station_free_connectors: "free",

    // Check-in
    checkin_title: "Check-in",
    checkin_charger_status: "Charger status",
    checkin_occupied_label: "Occupied (I'm charging)",
    checkin_connector_available: "Which connector is working again?",
    checkin_connector_occupied: "Which connector are you charging at?",
    checkin_connector_broken: "Which connector is broken?",
    checkin_no_connectors: "No connectors available at the moment",
    checkin_estimated_time: "Estimated charging time",
    checkin_confirm: "Confirm Check-in",
    checkin_success_title: "Check-in successful",
    checkin_success_message: "Thanks for reporting the charger status",
    checkin_failed: "Could not complete check-in",
    checkin_login_required: "You need to log in to check in",
    checkin_too_far_title: "Too far away",
    checkin_too_far_message: "You need to be within 300 meters of the station to check in.",

    // Release
    release_success_title: "Connector released",
    release_success_message: "The connector has been marked as available",
    release_failed: "Could not release connector",

    // Report
    report_login_required: "You need to log in to report",
    report_empty_text: "Describe where the station actually is",
    report_title: "Report location",
    report_subtitle: "Is the station not where the map shows? Describe where it actually is.",
    report_placeholder: "E.g.: It's on the opposite corner, on the north sidewalk...",
    report_hint: "Your current location will be sent as reference.",
    report_submit: "Submit report",
    report_success_title: "Report sent",
    report_success_message: "Thanks for helping correct the location. We'll review it soon.",
    report_failed: "Could not send report",

    // Notifications
    notification_still_charging: "Still charging?",
    notification_time_up: "Your time at {station} is up. The connector will be released in 3 minutes.",

    // Settings
    settings_title: "Settings",
    settings_distance_unit: "Distance unit",
    settings_km: "Kilometers (km)",
    settings_mi: "Miles (mi)",
    settings_language: "Language",
    settings_info: "Information",
    settings_version: "Version",

    // Settings - Avatar
    settings_map_avatar: "Map avatar",
    settings_avatar_default: "Blue dot (default)",
    settings_avatar_cars: "Cars",
    settings_avatar_animals: "Animals",

    // Settings - Delete Account
    settings_delete_account: "Delete account",
    settings_delete_confirm_title: "Delete your account?",
    settings_delete_confirm_message: "This action is irreversible. All your data, check-ins and favorites will be deleted.",
    settings_delete_enter_password: "Enter your password to confirm",
    settings_delete_password_placeholder: "Password",
    settings_delete_success: "Account deleted successfully",
    settings_delete_failed: "Could not delete account",
    settings_delete_button: "Delete my account",

    // Location
    location_permission_denied: "Location permission denied",
  },

  pt: {
    // Auth - Welcome
    auth_welcome_subtitle: "Encontre carregadores para seu veículo elétrico no Uruguai",
    auth_start: "Começar",
    auth_have_account: "Já tenho conta",

    // Auth - Login
    auth_login_title: "Entrar",
    auth_login_subtitle: "Bem-vindo de volta ao VEGO",
    auth_email: "Email",
    auth_password: "Senha",
    auth_logging_in: "Entrando...",
    auth_login: "Entrar",
    auth_login_failed: "Não foi possível entrar",

    // Auth - Register
    auth_register_title: "Criar Conta",
    auth_register_subtitle: "Junte-se à comunidade VEGO",
    auth_name: "Nome",
    auth_password_hint: "Senha (mín. 6 caracteres)",
    auth_registering: "Criando conta...",
    auth_register: "Cadastrar",
    auth_has_account: "Já tem conta? Faça login",
    auth_password_min: "A senha deve ter pelo menos 6 caracteres",
    auth_register_failed: "Não foi possível criar a conta",

    // Auth - Common
    auth_fill_all_fields: "Preencha todos os campos",

    // Common
    error: "Erro",
    cancel: "Cancelar",
    coming_soon: "Em breve",
    coming_soon_message: "Esta função estará disponível em breve",
    user_default: "Usuário",
    anonymous: "Anônimo",

    // Tabs
    tabs_map: "Mapa",
    tabs_favorites: "Favoritos",
    tabs_profile: "Perfil",
    tabs_header_map: "VEGO",
    tabs_header_favorites: "Favoritos",
    tabs_header_profile: "Meu Perfil",

    // Station status
    station_available: "Disponível",
    station_occupied: "Ocupado",
    station_broken: "Fora de serviço",
    station_broken_short: "Avariado",

    // Map
    map_no_chargers: "Não há carregadores disponíveis no momento",
    map_info: "Info",
    map_nearest: "Mais próximo",
    map_search_placeholder: "Buscar estação...",
    map_station_count_one: "estação",
    map_station_count_other: "estações",
    map_filter_all: "Todos",

    // Favorites
    favorites_empty_title: "Sem favoritos",
    favorites_empty_subtitle: "Salve seus carregadores favoritos para acesso rápido",

    // Profile
    profile_favorites: "Favoritos",
    profile_eco_points: "Eco-pontos",
    profile_checkins: "Check-ins",
    profile_notifications: "Notificações",
    profile_settings: "Configurações",
    profile_help: "Ajuda",
    profile_logout: "Sair",
    profile_logout_confirm: "Tem certeza?",

    // Station Detail
    station_not_found: "Estação não encontrada",
    station_connectors: "Conectores",
    station_power: "Potência",
    station_connector: "Conector",
    station_operator: "Operador",
    station_last_report: "Último relatório",
    station_report_by: "Por",
    station_report_status: "Status",
    station_report_connector: "Conector",
    station_report_time: "Há",
    station_report_duration: "Duração est.",
    station_directions: "Como chegar",
    station_report_location: "Reportar localização incorreta",
    station_release_connector: "Liberar conector",
    station_checkin: "Fazer Check-in",
    station_checkin_approach: "Aproxime-se para Check-in",
    station_distance_from_you: "A {distance} da sua localização",
    station_free_connectors: "livres",

    // Check-in
    checkin_title: "Check-in",
    checkin_charger_status: "Status do carregador",
    checkin_occupied_label: "Ocupado (estou carregando)",
    checkin_connector_available: "Qual conector voltou a funcionar?",
    checkin_connector_occupied: "Em qual conector você está carregando?",
    checkin_connector_broken: "Qual conector está avariado?",
    checkin_no_connectors: "Não há conectores disponíveis no momento",
    checkin_estimated_time: "Tempo estimado de carga",
    checkin_confirm: "Confirmar Check-in",
    checkin_success_title: "Check-in realizado",
    checkin_success_message: "Obrigado por reportar o status do carregador",
    checkin_failed: "Não foi possível realizar o check-in",
    checkin_login_required: "Você precisa fazer login para fazer check-in",
    checkin_too_far_title: "Muito longe",
    checkin_too_far_message: "Você precisa estar a menos de 300 metros da estação para fazer check-in.",

    // Release
    release_success_title: "Conector liberado",
    release_success_message: "O conector foi marcado como disponível",
    release_failed: "Não foi possível liberar o conector",

    // Report
    report_login_required: "Você precisa fazer login para reportar",
    report_empty_text: "Descreva onde a estação realmente está",
    report_title: "Reportar localização",
    report_subtitle: "A estação não está onde o mapa mostra? Descreva onde ela realmente está.",
    report_placeholder: "Ex: Está na esquina oposta, na calçada norte...",
    report_hint: "Sua localização atual será enviada como referência.",
    report_submit: "Enviar relatório",
    report_success_title: "Relatório enviado",
    report_success_message: "Obrigado por ajudar a corrigir a localização. Vamos revisar em breve.",
    report_failed: "Não foi possível enviar o relatório",

    // Notifications
    notification_still_charging: "Ainda carregando?",
    notification_time_up: "Seu tempo em {station} acabou. O conector será liberado em 3 minutos.",

    // Settings
    settings_title: "Configurações",
    settings_distance_unit: "Unidade de distância",
    settings_km: "Quilômetros (km)",
    settings_mi: "Milhas (mi)",
    settings_language: "Idioma",
    settings_info: "Informação",
    settings_version: "Versão",

    // Settings - Avatar
    settings_map_avatar: "Avatar no mapa",
    settings_avatar_default: "Ponto azul (padrão)",
    settings_avatar_cars: "Carros",
    settings_avatar_animals: "Animais",

    // Settings - Delete Account
    settings_delete_account: "Excluir conta",
    settings_delete_confirm_title: "Excluir sua conta?",
    settings_delete_confirm_message: "Esta ação é irreversível. Todos os seus dados, check-ins e favoritos serão excluídos.",
    settings_delete_enter_password: "Digite sua senha para confirmar",
    settings_delete_password_placeholder: "Senha",
    settings_delete_success: "Conta excluída com sucesso",
    settings_delete_failed: "Não foi possível excluir a conta",
    settings_delete_button: "Excluir minha conta",

    // Location
    location_permission_denied: "Permissão de localização negada",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["es"];
export type Translations = { [K in TranslationKey]: string };
