import { Box, Heading, Text, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Box textAlign="center" py={10} px={6}>
        <Box display="inline-block" mb={6}>
          <AlertTriangle size={80} color={useColorModeValue('#DD6B20', '#F6AD55')} />
        </Box>
        <Heading as="h2" size="xl" mb={2}>
          404
        </Heading>
        <Heading as="h3" size="lg" mb={6}>
          Page Not Found
        </Heading>
        <Text color={'gray.500'} mb={6}>
          The page you're looking for does not seem to exist
        </Text>

        <Button
          as={Link}
          to="/"
          colorScheme="orange"
          leftIcon={<Home size={20} />}
          size="lg"
        >
          Go to Home
        </Button>
      </Box>
    </Flex>
  );
}