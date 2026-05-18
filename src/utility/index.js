import moment from "moment";
import api from "../service/api";
import { request } from "../service/request";
import { API_METHOD } from "./constant";

export const createNavigationBarMenu = (name, path, icon, hasBorder = false) => {
  return {
    name,
    path,
    icon,
    hasBorder
  }
}

export const createAlumniData = (id, studentNumber, name, program, batchYear) => {
  return {
    id,
    studentNumber,
    name,
    program,
    batchYear
  };
}

export const createProductCategoryData = (id, categoryName, items) => {
  return {
    id,
    categoryName,
    items
  };
}

export const createPieProductCategoryData = (id, title, value, color) => {
  return {
    id,
    title,
    value,
    color
  };
}

export const createUserData = (id, name, role) => {
  return {
    id,
    name,
    role
  };
}

export const createAuditLogData = (id, timeStamp, user, entity, operation, details) => {
  return {
    id,
    timeStamp,
    user, 
    entity,
    operation,
    details
  };
}

export const createSysAdData = (id, name, email) => {
  return {
    id,
    name,
    email
  };
}

export const createStoreData = (id, name, address, status) => {
  return {
    id,
    name,
    address,
    status
  };
}

export const createProductItemData = (id, productNumber, name, genericName, category, price, stock) => {
  return {
    id,
    productNumber,
    name,
    genericName,
    category,
    price,
    stock,
  };
}

export const createProductItem = (id, productNumber, name, category, price, stock, tempStock) => {
  return {
    id,
    productNumber,
    name,
    category,
    price,
    stock,
    tempStock
  };
}

export const createTransactionData = (id, transactionNum, items, date, user, admin, totalPrice, status) => {
  return {
    id,
    transactionNum,
    items,
    date,
    user,
    admin,
    totalPrice,
    status
  };
}

export const createReservationData = (transactionId, reservationId, id, name, items, date, totalPrice, reference, status) => {
  return {
    transactionId,
    reservationId,
    id,
    name,
    items,
    date,
    totalPrice,
    reference,
    status
  };
}

export const createProgramData = (id, name, institute) => {
  return {
    id,
    name,
    institute
  };
}

export const createPersonnelData = (id, name, title, department) => {
  return {
    id,
    name,
    title,
    department,
  };
}

export const createInstituteData = (id, name) => {
  return {
    id,
    name
  };
}

export const createHeadCells =  (id, numeric, label, primaryHeader, isSort, isHidden = false) => {
  return {
    id: id,
    numeric: numeric,
    disablePadding: false,
    primaryHeader: primaryHeader,
    label: label,
    isSort,
    isHidden
  }
}


export const getLocalStorageItem = (storageKey) => {
  const savedState = localStorage.getItem(storageKey);
  try {
    if (!savedState) {
      return undefined;
    }
    return JSON.parse(savedState ?? '{}');
  } catch (e) {
    return undefined;
  }
}

export const setLocalStorageItem = (storageKey, state) => {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export const isTokenExpired = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  const data = JSON.parse(jsonPayload);
  const expirationDate = data.exp;
  const currentDate = new Date().getTime() / 1000;
  return currentDate >= expirationDate;
}

export const getBatchYear = (givenYear) => {
  const currentYear = new Date().getFullYear();
  let years = [];

  for (let year = givenYear; year <= currentYear; year++) {
    years.push({ 
     name: year.toString(),
    });
  }

  return years;
}


export const capitalizeWords = (value) => {
  return value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
}

export const handlePreventNegative = (e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
  }
};

export const handleInputChange = (formik, fieldName) => (e) => {
  const { value } = e.target;
  const capitalizedValue = capitalizeWords(value);
  formik.setFieldValue(fieldName, capitalizedValue);
}

export const handleInputNumberChange = (formik, fieldName) => (e) => {
  const { value } = e.target;
  const numericValue = value === "" ? "" : Math.max(0, Number(value)); // Ensure non-negative
  formik.setFieldValue(fieldName, numericValue);
}

export const isValidPhoneNumber = (formik, fieldName) => (e) => {
  const { value } = e.target;

  // Remove non-numeric characters
  const numericValue = value.replace(/\D/g, '');

  // Limit the value to 11 digits
  const validValue = numericValue.length > 11 ? numericValue.slice(0, 11) : numericValue;

  formik.setFieldValue(fieldName, validValue);
};

export const handleAuditLog = async(context, entityId, storeId, entityName, operation, previousValue, newValue) => {
 await request({
  url: api.AUDIT_LOGS_API,
  method: API_METHOD.POST,
  data: {
    entityId,
    userId: context.user.userId,
    entityName,
    storeId,
    operation,
    previousValue,
    newValue
  }
 })
}

const getValuesCommaSeparated = (jsonData) => {
  // Extract the values from the JSON object
  const values = Object.values(jsonData);
  
  // Join the values into a comma-separated string
  return values.join(', ');
}

const getValuesWithKeys = (jsonData, name) => {
  // Function to convert camelCase to Capitalized case
  const capitalizeFirstLetter = (str) => {
    return str.replace(/([A-Z])/g, ' $1') // Add a space before uppercase letters
              .replace(/^./, (match) => match.toUpperCase()); // Capitalize the first letter
  }

  // Create an array of key-value pairs in the format 'Key: Value'
  const entries = Object.entries(jsonData).map(([key, value]) => {
    let formattedKey = capitalizeFirstLetter(key); // Capitalize camel case keys
    if (formattedKey === 'Second Address') {
      formattedKey = 'Barangay'
    } else if (formattedKey === 'First Address') {
      formattedKey = 'Street'
    } else if (formattedKey === 'City') {
      formattedKey = 'City/Municipality'
    } else if (formattedKey === 'State') {
      formattedKey = 'Province'
    } else if (name === 'products' && formattedKey === 'Name') {
      formattedKey = 'Product Number'
    }
    return `${formattedKey}: ${value}`;
  });

  // Join the entries into a comma-separated string
  return entries.join(', ');
}

const formatKey = (key) => {
  if (key.charAt(0) === key.charAt(0).toUpperCase() && key.slice(1) === key.slice(1).toLowerCase()) {
    return key; 
  }
  const result = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  return result.charAt(0).toUpperCase() + result.slice(1);
};


const getChangedValuesWithPreviousAndNew = (newValue, previousValue) => {
  const keys = Object.keys(newValue);

  const changes = [];

  keys.forEach(key => {
      if (newValue[key] !== previousValue[key] && previousValue[key] !== undefined && newValue[key] !== undefined) {
        let key1 = formatKey(key)
        if (key1 === 'Second address') {
          key1 = 'Barangay'
        } else if (key1 === 'First address') {
          key1 = 'Street'
        } else if (key1 === 'City') {
          key1 = 'City/Municipality'
        } else if (key1 === 'State') {
          key1 = 'Province'
        }
          changes.push(`${key1} changed from "${previousValue[key]}" to "${newValue[key]}"`);
      }
  });

  return changes.join(', ');
}



export const createAuditLogDetails = (item, name) => {
  const { entityId, entityName, newValue, previousValue, timeStamp, operation } = item;

  if (operation === 'created') {
    const details = getValuesWithKeys(newValue);
    return `On ${moment(timeStamp).format('LLL')}, ${name} ${operation} a new ${entityName} record with the following details: ${details}`
  } else if (operation === 'updated') {
    const changes = getChangedValuesWithPreviousAndNew(newValue, previousValue);

    return `On ${moment(timeStamp).format('LLL')}, ${name} ${operation} the ${entityName} record (ID: ${entityId}) with the following details: ${changes}`
  } else {
    const details = getValuesWithKeys(previousValue, entityName);
    return `On ${moment(timeStamp).format('LLL')}, ${name} ${operation} the ${entityName} record (ID: ${entityId}) which had the details: ${details}`
  }
}