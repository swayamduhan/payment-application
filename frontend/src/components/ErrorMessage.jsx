import { Alert } from '@mui/material';

export const ErrorMessage = ({ error, label, setError }) => {
  return (
    <div id='error-div' className={`w-screen ${error ? "" : "hidden"} absolute`}>
      <Alert severity="error" onClose={()=>{setError(false)}}>{label}</Alert>
    </div>
  );
};
