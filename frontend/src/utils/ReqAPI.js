import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

function getData ( url, state, setter, loading )
{
  // console.log( `${ API }/api/${ url }` )
  axios
    .get( `${ API }/api/${ url }` )
    .then( ( response ) =>
    {
      setter( response.data );
      loading( false );
    } )
    .catch( ( error ) =>
    {
      console.error( "Error fetching data:", error );
    } );
}

export { getData }