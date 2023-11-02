//Componentes
import SnackbarMUI from '../components/SnackbarMUI.js';

//Custom Hooks
import useAuth from '../hooks/useAuth.js';

//NextUI
import { Card, CardBody, Divider, Button, Input, Tabs, Tab, Link } from '@nextui-org/react';
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
        <Card className='w-[30%]' classNames={{ base: 'border-2 border-gray-300' }}>
          <Tabs
            fullWidth
            size='lg'
            aria-label='Tabs form'
            className='px-10 pt-5  flex justify-center'
            selectedKey={typeOfAuth}
            classNames={{
              tabList: 'flex justify-start items-start',
            }}
            onSelectionChange={setTypeOfAuth as any}
          >
            <Tab key='Signin' title='Iniciar Sesion'>
              <Divider />
              <CardBody className='overflow-hidden'>
                <div className='w-full h-72 py-10 flex gap-5 flex-col'>
                  <Input
                    type='email'
                    variant='bordered'
                    label='Email'
                    className='h-full flex justify-center'
                    validationState={errMessage?.type === 'Email' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Email' && errMessage?.message}
                    value={email}
                    onValueChange={setEmail}
                  />
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    variant='bordered'
                    label='Contraseña'
                    className='h-full flex justify-center'
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
              <div className='m-3 gap-5 justify-end'>
                <span className='flex justify-center mb-2 mt-1'>
                  <h2>
                    ¿No tienes cuenta?{' '}
                    <Link className='cursor-pointer' onClick={() => setTypeOfAuth('SignUp')}>
                      Regístrate
                    </Link>
                  </h2>
                </span>
                <Button className='w-full' color='success' variant='ghost' type='submit' onClick={onSignIn}>
                  Iniciar Sesion
                </Button>
              </div>
            </Tab>

            <Tab key='SignUp' title='Registrarse'>
              <Divider />
              <CardBody>
                <div className='w-full h-72 flex gap-5 flex-col'>
                  <Input
                    type='text'
                    variant='bordered'
                    label='Nombre'
                    className='h-full flex justify-center'
                    validationState={errMessage?.type === 'Name' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Name' && errMessage?.message}
                    value={name}
                    onValueChange={setName}
                  />
                  <Input
                    type='email'
                    variant='bordered'
                    label='Email'
                    className='h-full flex justify-center'
                    validationState={errMessage?.type === 'Email' ? 'invalid' : 'valid'}
                    errorMessage={errMessage?.type === 'Email' && errMessage?.message}
                    value={email}
                    onValueChange={setEmail}
                  />
                  <Input
                    type={isPasswordVisible ? 'text' : 'password'}
                    variant='bordered'
                    label='Contraseña'
                    className='h-full flex justify-center'
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
              <div className='m-3 gap-5 justify-end'>
                <span className='flex justify-center mb-2 mt-1'>
                  <h2>
                    ¿Ya estás Registrado?{' '}
                    <Link className='cursor-pointer' onClick={() => setTypeOfAuth('Signin')}>
                      Inicia Sesión
                    </Link>
                  </h2>
                </span>
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
