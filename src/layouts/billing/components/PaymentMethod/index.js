import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Container,
  Paper,
  Slide,
  styled,
} from '@mui/material';
// Should be something like:

import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import CheckIcon from '@mui/icons-material/Check';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StepContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const steps = ['Type et montant', 'Informations sur les dépenses', 'Informations complémentaires', 'Note'];

const ExpenseDialog = () => {
    const [step, setStep] = useState(0);
    const [expenseType, setExpenseType] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [category, setCategory] = useState('');
    const [maintenancePayment, setMaintenancePayment] = useState('');
    const [supplier, setSupplier] = useState('');
    const [note, setNote] = useState('');
    const [supplierError, setSupplierError] = useState(false);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <DashboardLayout>
  
    <RootContainer maxWidth="sm">
      <Paper>
        <Typography variant="h4" gutterBottom>
          Ajouter une dépense
        </Typography>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <StepContent>
            {step === 0 && (
              <>
                <Typography variant="h6">Étape 1: Type et montant</Typography>
                <TextField
                  label="00000"
                  fullWidth
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className={FormControlStyled}
                />
                <FormControlStyled fullWidth>
                  <InputLabel id="expense-type-label">Type de dépense</InputLabel>
                  <br/>
                  <Select
                    labelId="expense-type-label"
                    value={expenseType}
                    onChange={(e) => setExpenseType(e.target.value)}
                  >
                    <MenuItem value="espèces">
                      <Box display="flex" alignItems="center">
                        <MoneyIcon style={{ marginRight: 8 }} />
                        Espèces
                      </Box>
                    </MenuItem>
                    <MenuItem value="chèque">
                      <Box display="flex" alignItems="center">
                        <CheckIcon style={{ marginRight: 8 }} />
                        Chèque
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControlStyled>
                <ButtonStyled variant="contained" color="primary" onClick={handleNextStep}>
                  Suivant
                </ButtonStyled>
              </>
            )}
            {step === 1 && (
              <>
                <Typography variant="h6">Étape 2: Informations sur les dépenses</Typography>
                <FormControlStyled fullWidth>
                <InputLabel id="category-label">Catégorie</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="entretien">Entretien</MenuItem>
                    <MenuItem value="réparation">Réparation</MenuItem>
                    <MenuItem value="autre">Autre</MenuItem>
                  </Select>
                </FormControlStyled>
               
                <FormControlStyled fullWidth error={supplierError}>
                  <TextField
                    label="Fournisseur"
                    fullWidth
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    required
                    helperText={supplierError ? "Fournisseur est obligatoire" : ""}
                  />
                </FormControlStyled>
                <ButtonStyled onClick={handlePreviousStep}>
                  Précédent
                </ButtonStyled>
                <ButtonStyled variant="contained" color="primary" onClick={handleNextStep}>
                  Suivant
                </ButtonStyled>
              </>
            )}
            {step === 2 && (
              <>
                <Typography variant="h6">Étape 3: Informations complémentaires</Typography>
                {/* Ajoutez ici les champs pour les informations complémentaires */}
                <ButtonStyled onClick={handlePreviousStep}>
                  Précédent
                </ButtonStyled>
                <ButtonStyled variant="contained" color="primary" onClick={handleNextStep}>
                  Suivant
                </ButtonStyled>
              </>
            )}
            {step === 3 && (
              <>
                <Typography variant="h6">Étape 4: Note</Typography>
                <TextField
                  label="Note"
                  fullWidth
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={FormControlStyled}
                />
                <ButtonStyled onClick={handlePreviousStep}>
                  Précédent
                </ButtonStyled>
                <ButtonStyled variant="contained" color="primary">
                  Terminé
                </ButtonStyled>
              </>
            )}
          </StepContent>
        </Slide>
      </Paper>
    </RootContainer>
    </DashboardLayout>
  );
};

export default ExpenseDialog;
