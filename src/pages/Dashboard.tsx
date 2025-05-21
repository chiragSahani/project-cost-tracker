import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Icon,
  useColorModeValue,
  Button,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Package, Coffee, DollarSign, TrendingUp, ChevronRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchItems } from '../store/itemsSlice';
import { fetchOtherCosts } from '../store/otherCostsSlice';
import { RootState, AppDispatch } from '../store';
import { Item, OtherCost } from '../lib/supabaseClient';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status: itemsStatus, error: itemsError } = useSelector(
    (state: RootState) => state.items
  );
  const { otherCosts, status: otherCostsStatus, error: otherCostsError } = useSelector(
    (state: RootState) => state.otherCosts
  );
  
  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchOtherCosts());
  }, [dispatch]);
  
  const isLoading = itemsStatus === 'loading' || otherCostsStatus === 'loading';
  
  // Calculate total costs
  const { itemsTotal, otherCostsTotal, totalCost } = useMemo(() => {
    const itemsTotal = items.reduce((sum: number, item: Item) => sum + Number(item.cost), 0);
    const otherCostsTotal = otherCosts.reduce(
      (sum: number, cost: OtherCost) => sum + Number(cost.amount),
      0
    );
    const totalCost = itemsTotal + otherCostsTotal;
    
    return { itemsTotal, otherCostsTotal, totalCost };
  }, [items, otherCosts]);
  
  // Error handling
  if (itemsError || otherCostsError) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error Loading Data
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {itemsError || otherCostsError}
        </AlertDescription>
        <Button
          mt={4}
          colorScheme="red"
          onClick={() => {
            dispatch(fetchItems());
            dispatch(fetchOtherCosts());
          }}
        >
          Try Again
        </Button>
      </Alert>
    );
  }
  
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} color="primary.600">
        Project Overview
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        {/* Total Cost Card */}
        <Stat
          px={{ base: 4, md: 6 }}
          py="5"
          shadow="md"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.500')}
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          transition="transform 0.3s"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
        >
          <Flex justifyContent="space-between">
            <Box pl={{ base: 2, md: 4 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Total Project Cost
              </StatLabel>
              <Skeleton isLoaded={!isLoading}>
                <StatNumber fontSize="2xl" fontWeight="bold" color="primary.500">
                  ${totalCost.toFixed(2)}
                </StatNumber>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {((items.length + otherCosts.length) > 0
                    ? ((totalCost / (items.length + otherCosts.length)) * 100) / 100
                    : 0
                  ).toFixed(2)}
                  % per item
                </StatHelpText>
              </Skeleton>
            </Box>
            <Box
              my="auto"
              color={useColorModeValue('primary.500', 'primary.200')}
              alignContent="center"
            >
              <DollarSign size={28} />
            </Box>
          </Flex>
        </Stat>
        
        {/* Items Cost Card */}
        <Stat
          px={{ base: 4, md: 6 }}
          py="5"
          shadow="md"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.500')}
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          transition="transform 0.3s"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
        >
          <Flex justifyContent="space-between">
            <Box pl={{ base: 2, md: 4 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Items Cost
              </StatLabel>
              <Skeleton isLoaded={!isLoading}>
                <StatNumber fontSize="2xl" fontWeight="bold" color="secondary.500">
                  ${itemsTotal.toFixed(2)}
                </StatNumber>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <StatHelpText>
                  <Flex align="center">
                    <Text>{items.length} items</Text>
                    <Button
                      as={RouterLink}
                      to="/items"
                      variant="link"
                      size="sm"
                      ml={2}
                      rightIcon={<ChevronRight size={16} />}
                      color="secondary.500"
                    >
                      View
                    </Button>
                  </Flex>
                </StatHelpText>
              </Skeleton>
            </Box>
            <Box
              my="auto"
              color={useColorModeValue('secondary.500', 'secondary.200')}
              alignContent="center"
            >
              <Package size={28} />
            </Box>
          </Flex>
        </Stat>
        
        {/* Other Costs Card */}
        <Stat
          px={{ base: 4, md: 6 }}
          py="5"
          shadow="md"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.500')}
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          transition="transform 0.3s"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
        >
          <Flex justifyContent="space-between">
            <Box pl={{ base: 2, md: 4 }}>
              <StatLabel fontWeight={'medium'} isTruncated>
                Other Costs
              </StatLabel>
              <Skeleton isLoaded={!isLoading}>
                <StatNumber fontSize="2xl" fontWeight="bold" color="accent.500">
                  ${otherCostsTotal.toFixed(2)}
                </StatNumber>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <StatHelpText>
                  <Flex align="center">
                    <Text>{otherCosts.length} expenses</Text>
                    <Button
                      as={RouterLink}
                      to="/other-costs"
                      variant="link"
                      size="sm"
                      ml={2}
                      rightIcon={<ChevronRight size={16} />}
                      color="accent.500"
                    >
                      View
                    </Button>
                  </Flex>
                </StatHelpText>
              </Skeleton>
            </Box>
            <Box
              my="auto"
              color={useColorModeValue('accent.500', 'accent.200')}
              alignContent="center"
            >
              <Coffee size={28} />
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>
      
      <Box
        mb={8}
        p={6}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="md" color="primary.600">
            Cost Breakdown
          </Heading>
          <Icon as={TrendingUp} color="primary.500" boxSize={5} />
        </Flex>
        
        <Skeleton isLoaded={!isLoading} height={isLoading ? "100px" : "auto"}>
          <Flex
            h="50px"
            w="100%"
            borderRadius="md"
            overflow="hidden"
            mb={4}
            position="relative"
          >
            {totalCost > 0 && (
              <>
                <Box
                  bg="secondary.500"
                  h="100%"
                  w={`${(itemsTotal / totalCost) * 100}%`}
                  transition="width 1s ease-in-out"
                  position="relative"
                >
                  {itemsTotal / totalCost > 0.1 && (
                    <Text
                      color="white"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {((itemsTotal / totalCost) * 100).toFixed(0)}%
                    </Text>
                  )}
                </Box>
                <Box
                  bg="accent.500"
                  h="100%"
                  w={`${(otherCostsTotal / totalCost) * 100}%`}
                  transition="width 1s ease-in-out"
                  position="relative"
                >
                  {otherCostsTotal / totalCost > 0.1 && (
                    <Text
                      color="white"
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {((otherCostsTotal / totalCost) * 100).toFixed(0)}%
                    </Text>
                  )}
                </Box>
              </>
            )}
            {totalCost === 0 && (
              <Flex
                bg="gray.100"
                h="100%"
                w="100%"
                justify="center"
                align="center"
              >
                <Text color="gray.500">No cost data to display</Text>
              </Flex>
            )}
          </Flex>
        </Skeleton>
        
        <Flex justify="space-between" mt={4}>
          <Flex align="center">
            <Box w="12px" h="12px" borderRadius="sm" bg="secondary.500" mr={2}></Box>
            <Text fontSize="sm">Items</Text>
          </Flex>
          <Flex align="center">
            <Box w="12px" h="12px" borderRadius="sm" bg="accent.500" mr={2}></Box>
            <Text fontSize="sm">Other Costs</Text>
          </Flex>
        </Flex>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          p={6}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="md" color="secondary.600">
              Recent Items
            </Heading>
            <Button
              as={RouterLink}
              to="/items"
              size="sm"
              rightIcon={<ChevronRight size={16} />}
              colorScheme="secondary"
              variant="outline"
            >
              View All
            </Button>
          </Flex>
          
          <Skeleton isLoaded={!isLoading} height={isLoading ? "150px" : "auto"}>
            {items.length > 0 ? (
              items
                .slice(0, 3)
                .map((item: Item) => (
                  <Flex
                    key={item.id}
                    justify="space-between"
                    align="center"
                    p={3}
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    <Text fontWeight="medium">{item.name}</Text>
                    <Text fontWeight="bold" color="secondary.500">
                      ${Number(item.cost).toFixed(2)}
                    </Text>
                  </Flex>
                ))
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                p={6}
                borderRadius="md"
                bg="gray.50"
              >
                <Package size={36} color="#A0AEC0" />
                <Text color="gray.500" mt={2}>
                  No items yet. Add your first item.
                </Text>
                <Button
                  as={RouterLink}
                  to="/items"
                  mt={4}
                  size="sm"
                  colorScheme="secondary"
                >
                  Add Items
                </Button>
              </Flex>
            )}
          </Skeleton>
        </Box>
        
        <Box
          p={6}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h2" size="md" color="accent.600">
              Recent Other Costs
            </Heading>
            <Button
              as={RouterLink}
              to="/other-costs"
              size="sm"
              rightIcon={<ChevronRight size={16} />}
              colorScheme="accent"
              variant="outline"
            >
              View All
            </Button>
          </Flex>
          
          <Skeleton isLoaded={!isLoading} height={isLoading ? "150px" : "auto"}>
            {otherCosts.length > 0 ? (
              otherCosts
                .slice(0, 3)
                .map((cost: OtherCost) => (
                  <Flex
                    key={cost.id}
                    justify="space-between"
                    align="center"
                    p={3}
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    <Text fontWeight="medium">{cost.description}</Text>
                    <Text fontWeight="bold" color="accent.500">
                      ${Number(cost.amount).toFixed(2)}
                    </Text>
                  </Flex>
                ))
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                p={6}
                borderRadius="md"
                bg="gray.50"
              >
                <Coffee size={36} color="#A0AEC0" />
                <Text color="gray.500" mt={2}>
                  No other costs yet. Add your first expense.
                </Text>
                <Button
                  as={RouterLink}
                  to="/other-costs"
                  mt={4}
                  size="sm"
                  colorScheme="accent"
                >
                  Add Expenses
                </Button>
              </Flex>
            )}
          </Skeleton>
        </Box>
      </SimpleGrid>
    </Box>
  );
}