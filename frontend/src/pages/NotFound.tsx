import { Link } from "react-router-dom";

const NotFound = () => {
  document.title = "ft_transcendence - Not found";
	return (
    <div className="NotFound" style={{textAlign: 'center'}}>
      <h1>404</h1>
		  <h2>
        This page does not exist. 
      </h2>
      <h3>
        Try going <Link to="/home">Home</Link>
      </h3>
    </div>
	);
}

export default NotFound;