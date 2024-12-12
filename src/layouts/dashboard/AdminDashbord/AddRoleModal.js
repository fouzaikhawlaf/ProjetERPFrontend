import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, FormLabel, useDisclosure } from '@chakra-ui/react';

const AddRoleModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>Add Role</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Role to User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>User ID</FormLabel>
            <Input placeholder="Enter user ID" />

            <FormLabel mt="4">Role</FormLabel>
            <Input placeholder="Enter role name" />
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

export default AddRoleModal;
