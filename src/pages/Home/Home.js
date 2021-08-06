import { useState, useEffect } from "react";
import {
  fetchCustomers,
  createCustomer as createCustomerService,
  updateCustomer as updateCustomerService,
  deleteCustomer as deleteCustomerService,
} from "../../services/customersService";
import { makeStyles, styled } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { SnackbarProvider, useSnackbar } from "notistack";

const BoldTableCell = styled(TableCell)({
  fontWeight: "bold",
});

const AlignedGrid = styled(Grid)({
  marginTop: "auto",
});

const useStyles = makeStyles({
  table: {
    minWidth: 150,
  },
});

const initialCustomer = {
  lastName: "",
  firstName: "",
  gender: "",
  street: "",
  postalCode: "",
  city: "",
};

function HomeComponent() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(initialCustomer);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(false);
  };

  const handleCustomer = (value, field) => {
    setCustomer({ ...customer, [field]: value });
  };

  const createCustomer = async () => {
    try {
      await createCustomerService(customer);
      enqueueSnackbar("Customer was created", {
        variant: "success",
      });
      await fetchData();
      setCustomer(initialCustomer);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      enqueueSnackbar(
        error && error.data ? error.data.message : "Something went wrong",
        {
          variant: "error",
        }
      );
    }
  };

  const handleUpdateCustomer = async (customer) => {
    setCustomer(customer);
    setOpen(true);
    setEditing(true);
  };

  const updateCustomer = async () => {
    try {
      await updateCustomerService(customer);
      enqueueSnackbar("Customer was edited", {
        variant: "success",
      });
      await fetchData();
      setCustomer(initialCustomer);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      enqueueSnackbar(
        error && error.data ? error.data.message : "Something went wrong",
        {
          variant: "error",
        }
      );
    }
  };

  const deleteCustomer = async (customer) => {
    try {
      await deleteCustomerService(customer);
      enqueueSnackbar("Customer was deleted", {
        variant: "success",
      });
      await fetchData();
    } catch (error) {
      console.log("error", error);
      enqueueSnackbar(
        error && error.data ? error.data.message : "Something went wrong",
        {
          variant: "error",
        }
      );
    }
  };

  const handleSearchTerm = async (term) => {
    setSearchTerm(term);
  };

  const searchCustomers = async () => {
    const fetchedCustomers = await fetchCustomers(searchTerm).then(
      (res) => res.customers
    );
    console.log(fetchedCustomers);
    setCustomers(fetchedCustomers);
  };

  const fetchData = async () => {
    const fetchedCustomers = await fetchCustomers().then(
      (res) => res.customers
    );
    console.log(fetchedCustomers);
    setCustomers(fetchedCustomers);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item>
          <TextField
            value={searchTerm}
            onChange={(e) => handleSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.code === "Enter") {
                searchCustomers();
              }
            }}
            label="search customer"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={searchCustomers}>
                    <Icon>search</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <AlignedGrid item>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            New customer
          </Button>
        </AlignedGrid>
      </Grid>
      {/* table of customers */}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <BoldTableCell>Last Name</BoldTableCell>
              <BoldTableCell>First Name</BoldTableCell>
              <BoldTableCell>Gender</BoldTableCell>
              <BoldTableCell>Street</BoldTableCell>
              <BoldTableCell>Postal Code</BoldTableCell>
              <BoldTableCell>City</BoldTableCell>
              <BoldTableCell></BoldTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.lastName}</TableCell>
                <TableCell>{customer.firstName}</TableCell>
                <TableCell>{customer.gender}</TableCell>
                <TableCell>{customer.street}</TableCell>
                <TableCell>{customer.postalCode}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>
                  <Grid container spacing={2}>
                    <Grid item>
                      <IconButton
                        onClick={() => handleUpdateCustomer(customer)}
                      >
                        <Icon color="action">edit</Icon>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => deleteCustomer(customer)}>
                        <Icon color="action">delete</Icon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* customer form dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                value={customer.lastName || ""}
                onChange={(e) => handleCustomer(e.target.value, "lastName")}
                autoFocus
                margin="dense"
                label="Last name"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={customer.firstName || ""}
                onChange={(e) => handleCustomer(e.target.value, "firstName")}
                margin="dense"
                id="name"
                label="First name"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={customer.gender || ""}
                onChange={(e) => handleCustomer(e.target.value, "gender")}
                margin="dense"
                id="name"
                label="Gender"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={customer.street || ""}
                onChange={(e) => handleCustomer(e.target.value, "street")}
                margin="dense"
                id="name"
                label="Street"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={customer.postalCode || ""}
                onChange={(e) => handleCustomer(e.target.value, "postalCode")}
                margin="dense"
                id="name"
                label="Postal code"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                value={customer.city || ""}
                onChange={(e) => handleCustomer(e.target.value, "city")}
                margin="dense"
                id="name"
                label="City"
                type="text"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          {!isEditing ? (
            <Button
              onClick={createCustomer}
              color="primary"
              disabled={
                !customer.lastName ||
                !customer.firstName ||
                !customer.gender ||
                !customer.street ||
                !customer.postalCode ||
                !customer.city
              }
            >
              Create customer
            </Button>
          ) : (
            <Button
              onClick={updateCustomer}
              color="primary"
              disabled={
                !customer.lastName ||
                !customer.firstName ||
                !customer.gender ||
                !customer.street ||
                !customer.postalCode ||
                !customer.city
              }
            >
              Edit customer
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function Home() {
  return (
    <SnackbarProvider maxSnack={3}>
      <HomeComponent />
    </SnackbarProvider>
  );
}
