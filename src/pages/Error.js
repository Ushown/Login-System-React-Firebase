import { Link } from "react-router-dom"

const Error = () => {
    return <div>
        <h2>402</h2>
        <p>Page does not exist</p>
        <p><Link to="/">Home Page</Link></p>
    </div>
}

export default Error