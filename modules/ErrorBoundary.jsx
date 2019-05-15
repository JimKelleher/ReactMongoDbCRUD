import React from 'react';


class ErrorBoundary extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        hasError: false,
        error: "",
        info: ""
      };

    }
  
    componentDidCatch(error, info) {

      // Display fallback UI
      this.setState({
        hasError: true,
        error: error.message,
        info: info.componentStack
      });

      // You can also log the error to an error reporting service
      //logErrorToMyService(error, info);

    }

    render() {

      if (this.state.hasError) {
        
        // You can render any custom fallback UI
        return (
        
          <div>
              <h1>Something went wrong.</h1>
              <h2>NOTE: This application does not support Internet Explorer.</h2>
              {this.state.error}<br /><br />
              {this.state.info}<br />
          </div>

        );
      }

      return this.props.children;
    }

  }

  export default ErrorBoundary;