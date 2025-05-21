import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
} from '@chakra-ui/react';
import { Eye, EyeOff, LogIn, DollarSign } from 'lucide-react';
import { signIn, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { status, error } = useSelector((state: RootState) => state.auth);
  
  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(signIn({ email, password })).unwrap();
      toast({
        title: 'Logged in successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Error is already handled in the auth slice
    }
  };
  
  return (
    <Container maxW="md" py={{ base: 12, md: 24 }}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Flex align="center" mb={4}>
            <DollarSign size={40} color={useColorModeValue('#3182CE', '#90CDF4')} />
          </Flex>
          <Heading fontSize={'4xl'} textAlign="center" color="primary.600">
            Project Cost Tracker
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} textAlign="center">
            Log in to manage your project costs
          </Text>
        </Stack>
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          as="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={!!emailError}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) dispatch(clearError());
                }}
              />
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>
            
            <FormControl id="password" isInvalid={!!passwordError}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearError());
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            </FormControl>
            
            <Stack spacing={10}>
              <Button
                leftIcon={<LogIn size={20} />}
                bg={'primary.500'}
                color={'white'}
                type="submit"
                isLoading={status === 'loading'}
                _hover={{
                  bg: 'primary.600',
                }}
                mt={4}
              >
                Sign in
              </Button>
            </Stack>
            
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link as={RouterLink} to="/signup" color={'primary.500'}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}