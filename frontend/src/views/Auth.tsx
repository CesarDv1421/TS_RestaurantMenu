//Componentes
import SnackbarMUI from '../components/SnackbarMUI.js';

//Custom Hooks
import useAuth from '../hooks/useAuth.js';

//NextUI
import { Card, CardBody, Divider, Button, Input, Tabs, Tab } from '@nextui-org/react';
import { EyeSlashFilledIcon, EyeFilledIcon } from '../components/Icons';

const Auth = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    typeOfAuth,
    setTypeOfAuth,
    errMessage,
    setErrMessage,
    isPasswordVisible,
    toggleVisibility,
    onSignIn,
    onSignUp,
  } = useAuth();

  return (
    <section>
      <form className='h-screen flex justify-center items-center'>
        <Card className='w-[30%]'>
          <Tabs
            fullWidth
            size='md'
            aria-label='Tabs form'
            className='px-10 py-5 pb-1'
            selectedKey={typeOfAuth}
            onSelectionChange={setTypeOfAuth}
          >
            <Tab key='Signin' title='Iniciar Sesion'>
              <Divider />
              <CardBody>
                <div className='w-full h-full flex gap-5 flex-col justify-evenly'>
                  <Input
                    type='email'
                    variant='bordered'
                    label='Email'
                    validationState={errMessage?.type === 'Email' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Email' && errMessage?.message}
                    value={email}
                    onValueChange={setEmail}
                  />
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    variant='bordered'
                    label='Contraseña'
                    validationState={errMessage?.type === 'Password' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Password' && errMessage?.message}
                    value={password}
                    onValueChange={setPassword}
                    endContent={
                      <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                        {isPasswordVisible ? (
                          <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                        ) : (
                          <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                        )}
                      </button>
                    }
                  />
                </div>
              </CardBody>
              <Divider />
              <div className='flex m-3 gap-5 justify-end'>
                <Button className='w-full' color='success' variant='ghost' type='submit' onClick={onSignIn}>
                  Iniciar Sesion
                </Button>
              </div>
            </Tab>

            <Tab key='SignUp' title='Registrarse'>
              <Divider />
              <CardBody>
                <div className='w-full h-full flex gap-5 flex-col justify-evenly'>
                  <Input
                    type='text'
                    variant='bordered'
                    label='Nombre'
                    validationState={errMessage?.type === 'Name' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Name' && errMessage?.message}
                    value={name}
                    onValueChange={setName}
                  />
                  <Input
                    type='email'
                    variant='bordered'
                    label='Email'
                    validationState={errMessage?.type === 'Email' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Email' && errMessage?.message}
                    value={email}
                    onValueChange={setEmail}
                  />
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    variant='bordered'
                    label='Contraseña'
                    validationState={errMessage?.type === 'Password' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Password' && errMessage?.message}
                    value={password}
                    onValueChange={setPassword}
                    endContent={
                      <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                        {isPasswordVisible ? (
                          <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                        ) : (
                          <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                        )}
                      </button>
                    }
                  />
                </div>
              </CardBody>
              <Divider />
              <div className='flex m-3 gap-5 justify-end'>
                <Button
                  className='w-full hover:text-white'
                  color='success'
                  variant='ghost'
                  type='submit'
                  onClick={onSignUp}
                >
                  Registrarse
                </Button>
              </div>
            </Tab>
          </Tabs>
        </Card>
      </form>
      {errMessage?.type === 'Server' && <SnackbarMUI message={errMessage} setMessage={setErrMessage} style='error' />}
    </section>
  );
};

export default Auth;
