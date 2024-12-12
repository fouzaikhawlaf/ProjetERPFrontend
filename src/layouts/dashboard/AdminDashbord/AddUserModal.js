import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, FormLabel, useDisclosure } from '@chakra-ui/react';

const AddUserModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>Add User</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Username</FormLabel>
            <Input placeholder="Enter username" />

            <FormLabel mt="4">Email</FormLabel>
            <Input placeholder="Enter email" />

            <FormLabel mt="4">Role</FormLabel>
            <Input placeholder="Enter role" />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserModal;
