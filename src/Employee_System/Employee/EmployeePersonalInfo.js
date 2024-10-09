// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Grid,
//   TextField,
//   FormControl,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   InputAdornment,
//   IconButton
// } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { BG, Gender} from './dropdownData'; // Assuming dropdownData has blood groups and gender options
// import { Country, State, City } from 'country-state-city';

// const EmployeePersonalInfo = ({ formData, handleChange, handleSubmit }) => {
//   const [errors, setErrors] = useState({});
//   const [copyAddress, setCopyAddress] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const countries = Country.getAllCountries();
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   const [permanentStates, setPermanentStates] = useState([]);
//   const [permanentCities, setPermanentCities] = useState([]);

//   useEffect(() => {
//     if (formData.country) {
//       const selectedCountry = countries.find(country => country.name === formData.country);
//       setStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
//     }
//   }, [formData.country, countries]);
  
//   useEffect(() => {
//     if (formData.state) {
//       const selectedState = states.find(state => state.name === formData.state);
//       setCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
//     }
//   }, [formData.state, states]);
  
//   useEffect(() => {
//     if (formData.permanentCountry) {
//       const selectedCountry = countries.find(country => country.name === formData.permanentCountry);
//       setPermanentStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
//     }
//   }, [formData.permanentCountry, countries]);
  
//   useEffect(() => {
//     if (formData.permanentstate) {
//       const selectedState = permanentStates.find(state => state.name === formData.permanentstate);
//       setPermanentCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
//     }
//   }, [formData.permanentstate, permanentStates]);
  

//   const validate = (name, value) => {
//     let error = '';

//     switch (name) {
//       case 'password':
//         if (value.length < 8) {
//           error = 'Password must be at least 8 characters long';
//         }
//         break;
//       case 'confirmPassword':
//         if (value !== formData.password) {
//           error = 'Passwords do not match';
//         }
//         break;
//       case 'adharNo':
//         if (!/^\d{12}$/.test(value)) {
//           error = 'Invalid Aadhar number';
//         }
//         break;
//       case 'panNo':
//         if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)){
//           error = 'Invalid Pan Number';
//         }
//         break;
//       case 'mobileNo':
//         if (!/^\d{10}$/.test(value)) {
//           error = 'Invalid mobile number';
//         }
//         break;
//       case 'parentNo':
//         if (!/^\d{10}$/.test(value)) {
//           error = 'Invalid parent number';
//         }
//         break;
//       default:
//         break;
//     }

//     setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
//     return error;
//   };

//   const handleBlur = (event) => {
//     const { name, value } = event.target;
//     validate(name, value);
//   };

//   const handleChangeWithValidation = (event) => {
//     const { name, value } = event.target;
//     handleChange(event);
//     validate(name, value);
//   };

//   const handleCheckboxChange = (event) => {
//     const isChecked = event.target.checked;
//     setCopyAddress(isChecked);
  
//     if (isChecked) {
//       handleChange({ target: { name: 'permanentAddress', value: formData.currentAddress } });
//       handleChange({ target: { name: 'permanentpinCode', value: formData.pinCode } });
//       handleChange({ target: { name: 'permanentlandmark', value: formData.landmark } });
//       handleChange({ target: { name: 'permanentdistrict', value: formData.district } });
//       handleChange({ target: { name: 'permanentcity', value: formData.city } });
//       handleChange({ target: { name: 'permanentstate', value: formData.state } });
//       handleChange({ target: { name: 'permanentCountry', value: formData.country } });
  
//       setPermanentStates(states);
//       setPermanentCities(cities);
//     }
//   };
  

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     const finalData = { ...formData };
//     handleSubmit(finalData); 
//   };

//   return (
//     <>
//      <Typography variant="h5" component="h3" gutterBottom style={{marginBottom:'30px'}}>
//           Employee Personal Info
//         </Typography>
//       <form onSubmit={handleFormSubmit}>
       
//         <Grid container spacing={3} className='textField-root'>
//           <Grid item xs={12} sm={4}>
//             <TextField            
//               required
//               label="Full Name"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <TextField
//                 required
//                 name="bloodGroup"
//                 value={formData.bloodGroup}
//                 onChange={handleChangeWithValidation}
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 label="Blood Group"
//                 select
//               >
//                 {BG.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <TextField
//                 required
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChangeWithValidation}
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 label="Gender"
//                 select
//               >
//                 {Gender.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               type="email"
//               label="Email"
//               name="email"
//               value={formData.email}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               type={showPassword ? 'text' : 'password'}
//               label="Password"
//               name="password"
//               value={formData.password}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onBlur={handleBlur}
//               error={!!errors.password}
//               helperText={errors.password}
//               fullWidth
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={() => setShowPassword(!showPassword)}
//                       onMouseDown={(e) => e.preventDefault()}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               type={showConfirmPassword ? 'text' : 'password'}
//               label="Confirm Password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onBlur={handleBlur}
//               error={!!errors.confirmPassword}
//               helperText={errors.confirmPassword}
//               fullWidth
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       onMouseDown={(e) => e.preventDefault()}
//                       edge="end"
//                     >
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               type="date"
//               label="DOB"
//               name="dob"
//               value={formData.dob}
//               onChange={handleChangeWithValidation}
//               fullWidth
//               InputLabelProps={{className: "required-asterisk", shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               type="number"
//               label="Aadhar No"
//               name="adharNo"
//               value={formData.adharNo}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onBlur={handleBlur}
//               error={!!errors.adharNo}
//               helperText={errors.adharNo}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="PAN No"
//               name="panNo"
//               value={formData.panNo}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onBlur={handleBlur}
//               error={!!errors.panNo}
//               helperText={errors.panNo}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="Mobile No"
//               name="mobileNo"
//               value={formData.mobileNo}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onBlur={handleBlur}
//               error={!!errors.mobileNo}
//               helperText={errors.mobileNo}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="Parent No"
//               name="parentNo"
//               value={formData.parentNo}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onBlur={handleBlur}
//               error={!!errors.parentNo}
//               helperText={errors.parentNo}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <TextField
//                 required
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChangeWithValidation}
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 label="Country"
//                 select
//               >
//                 {countries.map((option) => (
//                   <MenuItem key={option.name} value={option.name}>
//                     {option.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <TextField
//                 required
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChangeWithValidation}
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 label="State"
//                 select
//               >
//                 {states.map((option) => (
//                   <MenuItem key={option.name} value={option.name}>
//                     {option.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="District"
//               name="district"
//               value={formData.district}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <TextField
//                 required
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChangeWithValidation}
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 label="City"
//                 select
//               >
//                 {cities.map((option) => (
//                   <MenuItem key={option.name} value={option.name}>
//                     {option.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
         
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="PIN Code"
//               name="pinCode"
//               value={formData.pinCode}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="Landmark"
//               name="landmark"
//               value={formData.landmark}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               required
//               label="Current House No/ Area/ Flat No"
//               name="currentAddress"
//               value={formData.currentAddress}
//               onChange={handleChangeWithValidation}
//               InputLabelProps={{ className: "required-asterisk" }}
//               fullWidth
//               multiline
//               rows={1}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={copyAddress}
//                   onChange={handleCheckboxChange}
//                   name="copyAddress"
//                 />
//               }
//               label="Same as Current Address"
//             />
//           </Grid>
//           {copyAddress ? null : (
//             <>
//               <Grid item xs={12}>
//                 <TextField
//                   required
//                   label="Permanent House No/ Area/ Flat No"
//                   name="permanentAddress"
//                   value={formData.permanentAddress}
//                   onChange={handleChangeWithValidation}
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   fullWidth
//                   multiline
//                   rows={1}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
//                     required
//                     name="permanentCountry"
//                     value={formData.permanentCountry}
//                     onChange={handleChangeWithValidation}
//                     InputLabelProps={{ className: "required-asterisk" }}
//                     label="Permanent Country"
//                     select
//                   >
//                     {countries.map((option) => (
//                       <MenuItem key={option.name} value={option.name}>
//                         {option.name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
//                     required
//                     name="permanentstate"
//                     value={formData.permanentstate}
//                     onChange={handleChangeWithValidation}
//                     InputLabelProps={{ className: "required-asterisk" }}
//                     label="Permanent State"
//                     select
//                   >
//                     {permanentStates.map((option) => (
//                       <MenuItem key={option.name} value={option.name}>
//                         {option.name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               label="Permanent District"
//               name="permanentdistrict"
//               value={formData.permanentdistrict}
//               InputLabelProps={{ className: "required-asterisk" }}
//               onChange={handleChangeWithValidation}
//               fullWidth
//             />
//           </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
//                     required
//                     name="permanentcity"
//                     value={formData.permanentcity}
//                     onChange={handleChangeWithValidation}
//                     InputLabelProps={{ className: "required-asterisk" }}
//                     label="Permanent City"
//                     select
//                   >
//                     {permanentCities.map((option) => (
//                       <MenuItem key={option.name} value={option.name}>
//                         {option.name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
              
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   required
//                   label="Permanent PIN Code"
//                   name="permanentpinCode"
//                   value={formData.permanentpinCode}
//                   onChange={handleChangeWithValidation}
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   required
//                   label="Permanent Landmark"
//                   name="permanentlandmark"
//                   value={formData.permanentlandmark}
//                   onChange={handleChangeWithValidation}
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   fullWidth
//                 />
//               </Grid>
              
//             </>
//           )}
//         </Grid>      
//         </form>
//     </>
//   );
// };

// export default EmployeePersonalInfo;

// EmployeePersonalInfo.jsx


import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { BG, Gender, districts } from './dropdownData'; // Import districts
import { Country, State, City } from 'country-state-city';

const EmployeePersonalInfo = ({ formData, handleChange, handleSubmit }) => {
  const [errors, setErrors] = useState({});
  const [copyAddress, setCopyAddress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [permanentStates, setPermanentStates] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);

  // Districts for current address
  const [districtsList, setDistrictsList] = useState([]);

  // Districts for permanent address
  const [permanentDistrictsList, setPermanentDistrictsList] = useState([]);

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(country => country.name === formData.country);
      setStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
    } else {
      setStates([]);
      // setCities([]);
    }
  }, [formData.country, countries]);

  useEffect(() => {
    if (formData.state) {
      const selectedState = states.find(state => state.name === formData.state);
      // setCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
      // Set districts based on selected state
      setDistrictsList(districts[formData.state] || []);
    } else {
      // setCities([]);
      setDistrictsList([]);
    }
  }, [formData.state, states]);

  useEffect(() => {
    if (formData.permanentCountry) {
      const selectedCountry = countries.find(country => country.name === formData.permanentCountry);
      setPermanentStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
    } else {
      setPermanentStates([]);
      // setPermanentCities([]);
    }
  }, [formData.permanentCountry, countries]);

  useEffect(() => {
    if (formData.permanentstate) {
      const selectedState = permanentStates.find(state => state.name === formData.permanentstate);
      // setPermanentCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
      // Set permanent districts based on selected state
      setPermanentDistrictsList(districts[formData.permanentstate] || []);
    } else {
      // setPermanentCities([]);
      setPermanentDistrictsList([]);
    }
  }, [formData.permanentstate, permanentStates]);

  const validate = (name, value) => {
    let error = '';

    switch (name) {
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters long';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'adharNo':
        if (!/^\d{12}$/.test(value)) {
          error = 'Invalid Aadhar number';
        }
        break;
      case 'panNo':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)){
          error = 'Invalid PAN number';
        }
        break;
      case 'mobileNo':
        if (!/^\d{10}$/.test(value)) {
          error = 'Invalid mobile number';
        }
        break;
      case 'parentNo':
        if (!/^\d{10}$/.test(value)) {
          error = 'Invalid parent number';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validate(name, value);
  };

  const handleChangeWithValidation = (event) => {
    const { name, value } = event.target;
    handleChange(event);
    validate(name, value);
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setCopyAddress(isChecked);
  
    if (isChecked) {
      handleChange({ target: { name: 'permanentAddress', value: formData.currentAddress } });
      handleChange({ target: { name: 'permanentpinCode', value: formData.pinCode } });
      handleChange({ target: { name: 'permanentlandmark', value: formData.landmark } });
      handleChange({ target: { name: 'permanentdistrict', value: formData.district } });
      handleChange({ target: { name: 'permanentcity', value: formData.city } });
      handleChange({ target: { name: 'permanentstate', value: formData.state } });
      handleChange({ target: { name: 'permanentCountry', value: formData.country } });
  
      setPermanentStates(states);
      setPermanentCities(cities);
      setPermanentDistrictsList(districtsList);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const finalData = { ...formData };
    handleSubmit(finalData); 
  };

  return (
    <>
      <Typography variant="h5" component="h3" gutterBottom style={{marginBottom:'30px'}}>
        Employee Personal Info
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3} className='textField-root'>
          {/* Full Name */}
          <Grid item xs={12} sm={4}>
            <TextField            
              required
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              fullWidth
            />
          </Grid>

          {/* Blood Group */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                required
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="Blood Group"
                select
              >
                {BG.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          {/* Gender */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                required
                name="gender"
                value={formData.gender}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="Gender"
                select
              >
                {Gender.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              fullWidth
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              onBlur={handleBlur}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              onBlur={handleBlur}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* DOB */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              type="date"
              label="DOB"
              name="dob"
              value={formData.dob}
              onChange={handleChangeWithValidation}
              fullWidth
              InputLabelProps={{className: "required-asterisk", shrink: true }}
            />
          </Grid>

          {/* Aadhar No */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              type="number"
              label="Aadhar No"
              name="adharNo"
              value={formData.adharNo}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              onBlur={handleBlur}
              error={!!errors.adharNo}
              helperText={errors.adharNo}
              fullWidth
            />
          </Grid>

          {/* PAN No */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="PAN No"
              name="panNo"
              value={formData.panNo}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              onBlur={handleBlur}
              error={!!errors.panNo}
              helperText={errors.panNo}
              fullWidth
            />
          </Grid>

          {/* Mobile No */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Mobile No"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              onBlur={handleBlur}
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
              fullWidth
            />
          </Grid>

          {/* Parent No */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Parent No"
              name="parentNo"
              value={formData.parentNo}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              onBlur={handleBlur}
              error={!!errors.parentNo}
              helperText={errors.parentNo}
              fullWidth
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                required
                name="country"
                value={formData.country}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="Country"
                select
              >
                {countries.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                required
                name="state"
                value={formData.state}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="State"
                select
              >
                {states.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          {/* District */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                required
                name="district"
                value={formData.district}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="District"
                select
              >
                {districtsList.length > 0 ? (
                  districtsList.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Select a state first</em>
                  </MenuItem>
                )}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
              <TextField
                required
                name="taluka"
                value={formData.taluka}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="Taluka"
                fullWidth
              />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={4}>
              <TextField
                required
                name="city"
                value={formData.city}
                onChange={handleChangeWithValidation}
                InputLabelProps={{ className: "required-asterisk" }}
                label="City"
                fullWidth
              />
          </Grid>

          {/* PIN Code */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="PIN Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              fullWidth
            />
          </Grid>

          {/* Landmark */}
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              fullWidth
            />
          </Grid>

          {/* Current Address */}
          <Grid item xs={12}>
            <TextField
              required
              label="Current House No/ Area/ Flat No"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              fullWidth
              multiline
              rows={1}
            />
          </Grid>

          {/* Copy Address Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={copyAddress}
                  onChange={handleCheckboxChange}
                  name="copyAddress"
                />
              }
              label="Same as Current Address"
            />
          </Grid>

          {/* Permanent Address Fields */}
          {copyAddress ? null : (
            <>
              {/* Permanent Address */}
              <Grid item xs={12}>
                <TextField
                  required
                  label="Permanent House No/ Area/ Flat No"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChangeWithValidation}
                  InputLabelProps={{ className: "required-asterisk" }}
                  fullWidth
                  multiline
                  rows={1}
                />
              </Grid>

              {/* Permanent Country */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    name="permanentCountry"
                    value={formData.permanentCountry}
                    onChange={handleChangeWithValidation}
                    InputLabelProps={{ className: "required-asterisk" }}
                    label="Permanent Country"
                    select
                  >
                    {countries.map((option) => (
                      <MenuItem key={option.name} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              {/* Permanent State */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    name="permanentstate"
                    value={formData.permanentstate}
                    onChange={handleChangeWithValidation}
                    InputLabelProps={{ className: "required-asterisk" }}
                    label="Permanent State"
                    select
                  >
                    {permanentStates.map((option) => (
                      <MenuItem key={option.name} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              {/* Permanent District */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    required
                    name="permanentdistrict"
                    value={formData.permanentdistrict}
                    onChange={handleChangeWithValidation}
                    InputLabelProps={{ className: "required-asterisk" }}
                    label="Permanent District"
                    select
                  >
                    {permanentDistrictsList.length > 0 ? (
                      permanentDistrictsList.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">
                        <em>Select a state first</em>
                      </MenuItem>
                    )}
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    name="permanenttaluka"
                    value={formData.permanenttaluka}
                    onChange={handleChangeWithValidation}
                    InputLabelProps={{ className: "required-asterisk" }}
                    label="Permanent Taluka"
                    fullWidth
                  />
              </Grid>

              {/* Permanent City */}
              <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    name="permanentcity"
                    value={formData.permanentcity}
                    onChange={handleChangeWithValidation}
                    InputLabelProps={{ className: "required-asterisk" }}
                    label="Permanent City"
                    fullWidth
                  />
              </Grid>

              {/* Permanent PIN Code */}
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="Permanent PIN Code"
                  name="permanentpinCode"
                  value={formData.permanentpinCode}
                  onChange={handleChangeWithValidation}
                  InputLabelProps={{ className: "required-asterisk" }}
                  fullWidth
                />
              </Grid>

              {/* Permanent Landmark */}
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="Permanent Landmark"
                  name="permanentlandmark"
                  value={formData.permanentlandmark}
                  onChange={handleChangeWithValidation}
                  InputLabelProps={{ className: "required-asterisk" }}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
      </form>
    </>
  );
};

export default EmployeePersonalInfo;
