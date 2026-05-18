const API_BASE_PATH = window.API_BASE_PATH;

const api = {
  RESET_PASSWORD                    : `${API_BASE_PATH}/auth/reset-password`,
  LOGIN                             : `${API_BASE_PATH}/public/login`,
  NEW_PASSWORD                      : `${API_BASE_PATH}/auth/new-password`,
  ADMINISTRATORS_BY_TOKEN           : `${API_BASE_PATH}/auth/search/findByToken`,
  USERS_BY_TOKEN                    : `${API_BASE_PATH}/auth/user`,
  STORE_API                         : `${API_BASE_PATH}/store`,
  STORES_API                         : `${API_BASE_PATH}/stores`,
  PRODUCT_CATEGORIES_API            : `${API_BASE_PATH}/productCategories`,
  PRODUCT_CATEGORY_API              : `${API_BASE_PATH}/productCategory`,
  PRODUCT_CATEGORIES_BY_STORE_ID_API: `${API_BASE_PATH}/productCategories/search/findByStoreStoreId`,
  PRODUCT_ITEMS_API                 : `${API_BASE_PATH}/productItems`,
  PRODUCT_ITEM_API                  : `${API_BASE_PATH}/productItem`,
  TRANSACTION_API                   : `${API_BASE_PATH}/transaction`,
  TRANSACTIONS_API                   : `${API_BASE_PATH}/transactions`,
  RESERVATIONS_API                   : `${API_BASE_PATH}/reservations`,
  RESERVATION_API                   : `${API_BASE_PATH}/reservation`,
  OPENING_HOURS_API                   : `${API_BASE_PATH}/openingHours`,
  CHAT_ROOMS_API                   : `${API_BASE_PATH}/chatRooms`,
  CHAT_ROOM_API                   : `${API_BASE_PATH}/chatRoom`,
  WEBSOCKET_API                   : `${API_BASE_PATH}/websocket`,
  
  USERS_API    : `${API_BASE_PATH}/users`,
  USER_API     : `${API_BASE_PATH}/user`,
  APP_USERS_API: `${API_BASE_PATH}/appUsers`,
  AUDIT_LOGS_API : `${API_BASE_PATH}/auditLogs`,
  NOTIFICATIONS_API: `${API_BASE_PATH}/notifications`,
};

export default api;