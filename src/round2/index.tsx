import React, {useEffect} from 'react';
import ProductProvider from './context';
import ProductList from './screens/productList';
import {getItem, removeItem} from './store';
import LogIn from './screens/login';
import SignUp from './screens/signUp';

const App = () => {
  const [isHydrate, setIsHydrate] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);

  useEffect(() => {
    (async () => {
      const data = await getItem('isLoggedIn');
      setIsHydrate(true);
      setIsLoggedIn(!!data);
    })();
  }, []);

  const handleLogOut = async () => {
    setIsLoggedIn(false);
    setIsSignup(false);
    await removeItem('cart');
  };

  if (!isHydrate) {
    return null;
  }

  if (!isLoggedIn) {
    if (isSignup) {
      return <SignUp setIsLogIn={setIsLoggedIn} />;
    }
    return <LogIn setIsSignup={setIsSignup} setIsLogIn={setIsLoggedIn} />;
  }
  return (
    <ProductProvider>
      <ProductList setIsLogIn={handleLogOut} />
    </ProductProvider>
  );
};

export default App;
