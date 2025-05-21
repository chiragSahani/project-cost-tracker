import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
  Skeleton,
  useColorModeValue,
  Alert,
  AlertIcon,
  Text,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Plus, Edit2, Trash2, AlertCircle, Package } from 'lucide-react';
import { fetchItems, addItem, updateItem, deleteItem } from '../store/itemsSlice';
import { Item } from '../lib/supabaseClient';
import { RootState, AppDispatch } from '../store';

export default function Items() {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [nameError, setNameError] = useState('');
  const [costError, setCostError] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemCost(item.cost.toString());
    } else {
      setEditingItem(null);
      setItemName('');
      setItemCost('');
    }
    setNameError('');
    setCostError('');
    onOpen();
  };

  const validateForm = () => {
    let isValid = true;

    if (!itemName.trim()) {
      setNameError('Item name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!itemCost) {
      setCostError('Cost is required');
      isValid = false;
    } else if (isNaN(Number(itemCost)) || Number(itemCost) < 0) {
      setCostError('Cost must be a positive number');
      isValid = false;
    } else {
      setCostError('');
    }

    return isValid;
  };

  const handleSaveItem = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingItem) {
        await dispatch(
          updateItem({
            id: editingItem.id,
            name: itemName,
            cost: Number(itemCost),
          })
        ).unwrap();
        toast({
          title: 'Item updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await dispatch(
          addItem({
            name: itemName,
            cost: Number(itemCost),
          })
        ).unwrap();
        toast({
          title: 'Item added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: typeof err === 'string' ? err : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await dispatch(deleteItem(id)).unwrap();
        toast({
          title: 'Item deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: typeof err === 'string' ? err : 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const tableBackgroundColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl" color="secondary.600">
          Project Items
        </Heading>
        <Button
          leftIcon={<Plus size={18} />}
          colorScheme="secondary"
          onClick={() => handleOpenModal()}
          size="md"
        >
          Add Item
        </Button>
      </Flex>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {status === 'loading' ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : items.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          p={10}
          borderRadius="lg"
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Package size={50} color={useColorModeValue('#718096', '#A0AEC0')} />
          <Text mt={4} fontSize="xl" fontWeight="medium" color="gray.500">
            No items yet
          </Text>
          <Text color="gray.500" mb={6}>
            Add your first project item to track costs
          </Text>
          <Button
            leftIcon={<Plus size={18} />}
            colorScheme="secondary"
            onClick={() => handleOpenModal()}
          >
            Add Item
          </Button>
        </Flex>
      ) : (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Table variant="simple" bg={tableBackgroundColor}>
            <Thead>
              <Tr bg={useColorModeValue('gray.50', 'gray.700')}>
                <Th>Name</Th>
                <Th isNumeric>Cost</Th>
                <Th width="100px" textAlign="center">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item) => (
                <Tr
                  key={item.id}
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  transition="background-color 0.2s"
                >
                  <Td fontWeight="medium">{item.name}</Td>
                  <Td isNumeric fontWeight="bold" color="secondary.500">
                    ${Number(item.cost).toFixed(2)}
                  </Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <IconButton
                        aria-label="Edit item"
                        icon={<Edit2 size={18} />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => handleOpenModal(item)}
                      />
                      <IconButton
                        aria-label="Delete item"
                        icon={<Trash2 size={18} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Add/Edit Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isInvalid={!!nameError}>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                />
                <FormErrorMessage>{nameError}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!costError}>
                <FormLabel>Cost</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.500">
                    $
                  </InputLeftElement>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    placeholder="0.00"
                  />
                </InputGroup>
                <FormErrorMessage>{costError}</FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="secondary" onClick={handleSaveItem} isLoading={status === 'loading'}>
              {editingItem ? 'Update' : 'Save'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}