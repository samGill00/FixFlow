import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message, Icon } from 'semantic-ui-react';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Message icon warning>
      <Icon name="warning circle" />
      <Message.Content>
        <Message.Header>Page Not Found</Message.Header>
        Redirecting to homepage...
      </Message.Content>
    </Message>
  );
}

export default NotFound;
