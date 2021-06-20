import React, { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  ThemeProvider,
  createMuiTheme,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";

import styles from "../styles/form.module.css";


const PERFORMERS_REST_API_URL = "http://localhost:8080/performers";

const useStyles = makeStyles({
  table: {
    minWidth: "100%",
    background: "black",
  },
  tableContainer: {
    width: "50vw",
    height: "50vh",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: "-25vw",
    marginTop: "-25vh",
  },
});

export default function AddPerformer({ handleClose }) {
  const {
    setValue,
    handleSubmit,
    register,
    control,
    watch,
    trigger,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  console.log(errors);
  console.log(isValid);
  const [data, setData] = useState(null);

  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  console.log(watch("firstName"));
  console.log(watch("lastName"));
  console.log(watch("bio"));

  const onSubmit = async (data) => {
    console.log(data);
    const postPerformer = await axios.post(PERFORMERS_REST_API_URL, {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
    });

    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.pageModal}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formModal}>
          <Grid container>
            <Grid container xs={12} md={12} lg={12}>
              <Grid item md={8}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the performer's first name?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 2,
                      maxLength: 80,
                      message: "First name must contain at least 2 characters!",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          onChange={onChange}
                          value={value}
                          style={{ width: "100%" }}
                        />
                      </>
                    )}
                    name="firstName"
                    control={control}
                  />
                </section>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the performer's last name?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 2,
                      maxLength: 80,
                      message: "last name must contain at least 2 characters!",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          onChange={onChange}
                          value={value}
                          style={{ width: "100%" }}
                        />
                      </>
                    )}
                    name="lastName"
                    control={control}
                  />
                </section>
              </Grid>
              <Grid item md={8} lg={8}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the performer's bio?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 5,
                      maxLength: 80,
                      message: "The bio must contain at least 5 characters!",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          multiline
                          onChange={onChange}
                          value={value}
                          variant="outlined"
                          size="medium"
                          style={{ width: "100%" }}
                          className={styles.description}
                        />
                      </>
                    )}
                    name="bio"
                    control={control}
                  />
                </section>
              </Grid>
            </Grid>
            <Grid container xs={12} md={5} lg={5}>
              <Grid item md={8}>
                <Button
                  size="large"
                  style={{ float: "right" }}
                  variant={isValid ? "contained" : "disabled"}
                  onClick={handleSubmit(onSubmit)}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </main>
    </ThemeProvider>
  );
}
