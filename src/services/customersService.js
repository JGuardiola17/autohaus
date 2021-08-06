import axios from "axios";

export const fetchCustomers = async (searchTerm = null) => {
  console.log(searchTerm);
  return new Promise(async (resolve, reject) => {
    try {
      const customers = await axios
        .get("http://localhost:8000/api/customers", {
          ...(searchTerm ? { params: { lastName: searchTerm } } : {}),
        })
        .then((res) => res.data);

      resolve(customers);
    } catch (error) {
      console.log("error", error);
      reject(error.response || null);
    }
  });
};

export const createCustomer = (customer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdCustomer = await axios
        .post("http://localhost:8000/api/customers", customer)
        .then((res) => res.data);
      resolve(createdCustomer);
    } catch (error) {
      console.log("error", error);
      reject(error.response || null);
    }
  });
};

export const updateCustomer = (customer) => {
  console.log("customer", customer);
  return new Promise(async (resolve, reject) => {
    try {
      const updatedCustomer = await axios
        .put(`http://localhost:8000/api/customers/${customer._id}`, customer)
        .then((res) => res.data);
      console.log("updatedCustomer", updatedCustomer);
      resolve(updatedCustomer);
    } catch (error) {
      console.log("error", error);
      reject(error.response || null);
    }
  });
};

export const deleteCustomer = (customer) => {
  console.log("customer", customer);
  return new Promise(async (resolve, reject) => {
    try {
      const deletedCustomer = await axios
        .delete(`http://localhost:8000/api/customers/${customer._id}`, customer)
        .then((res) => res.data);
      console.log("deletedCustomer", deletedCustomer);
      resolve(deletedCustomer);
    } catch (error) {
      console.log("error", error);
      reject(error.response || null);
    }
  });
};

const services = { createCustomer, fetchCustomers, updateCustomer };

export default services;
