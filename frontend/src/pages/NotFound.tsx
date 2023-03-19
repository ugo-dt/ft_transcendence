import { Link } from "react-router-dom";

const NotFound = () => {
	return (
    <div className="NotFound">
		  <p>
        This page does not exist. Try going <Link to="/home" style={{textDecoration: 'none'}}>Home</Link>
      </p>
    </div>
	);
}

export default NotFound;