import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  useDisclosure,
  useColorModeValue,
  useToast,
  Container,
} from '@chakra-ui/react';
import { 
  Menu as MenuIcon, 
  X as CloseIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronRight as ChevronRightIcon,
  DollarSign, 
  BarChart,
  Package,
  Coffee,
  LogOut
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { signOut } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';

export default function Layout() {
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      toast({
        title: 'Signed out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: String(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useColorModeValue('left', 'center')}
            fontFamily={'heading'}
            fontWeight="bold"
            color={useColorModeValue('primary.600', 'white')}
            fontSize="xl"
            display="flex"
            alignItems="center"
            as={RouterLink}
            to="/dashboard"
          >
            <DollarSign size={24} style={{ marginRight: '8px' }} />
            Project Cost Tracker
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {user && (
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'red.400'}
              onClick={handleSignOut}
              _hover={{
                bg: 'red.500',
              }}
              leftIcon={<LogOut size={18} />}
            >
              Sign Out
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav onSignOut={handleSignOut} />
      </Collapse>

      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('primary.600', 'white');

  return (
    <Stack direction={'row'} spacing={4} alignItems="center">
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Box
            as={RouterLink}
            p={2}
            to={navItem.href ?? '#'}
            fontSize={'sm'}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}
            display="flex"
            alignItems="center"
          >
            {navItem.icon}
            <Box ml={2}>{navItem.label}</Box>
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ onSignOut }: { onSignOut: () => void }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
      boxShadow="md"
      zIndex={10}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Box py={2} onClick={onSignOut} cursor="pointer">
        <Flex
          align="center"
          _hover={{
            textDecoration: 'none',
            color: 'red.500',
          }}
          fontWeight={600}
        >
          <LogOut size={20} style={{ marginRight: '8px' }} />
          <Text fontWeight={600}>Sign Out</Text>
        </Flex>
      </Box>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, icon }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Flex align="center">
          {icon}
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}
            ml={2}
          >
            {label}
          </Text>
        </Flex>
        {children && (
          <Icon
            as={isOpen ? ChevronDownIcon : ChevronRightIcon}
            transition={'all .25s ease-in-out'}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Box as={RouterLink} key={child.label} py={2} to={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  icon?: React.ReactNode;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart size={20} style={{ marginRight: '4px' }} />,
  },
  {
    label: 'Items',
    href: '/items',
    icon: <Package size={20} style={{ marginRight: '4px' }} />,
  },
  {
    label: 'Other Costs',
    href: '/other-costs',
    icon: <Coffee size={20} style={{ marginRight: '4px' }} />,
  },
];