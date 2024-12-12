// Chakra imports
import { Flex, Icon, Link, Text, useColorMode , Avatar } from "@chakra-ui/react";
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import PropTypes from 'prop-types'; // Importer PropTypes
import { Card } from 'react-bootstrap'; // Importer Card de react-bootstrap
//import { useColorMode } from '@chakra-ui/react';
const ProfileInformation = ({
  title,
  description,
  name,
  mobile,
  email,
  location,
  avatarUrl, // Nouveau : ajout de l'avatar
}) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Card p='16px' my={{ sm: "24px", xl: "0px" }}>
      {/* Header avec le titre et l'avatar */}
      <div style={{ padding: '12px 5px', marginBottom: '12px', display: "flex", alignItems: "center" }}>
        {/* Avatar de l'utilisateur */}
        <Avatar src={avatarUrl} name={name} size="lg" mr="12px" />
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          {title}
        </Text>
      </div>
      
      <div style={{ padding: '5px' }}>
        <Flex direction='column'>
          {/* Description du profil */}
          <Text fontSize='md' color={secondaryTextColor} fontWeight='400' mb='30px'>
            {description}
          </Text>
          
          {/* Nom complet */}
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Full Name:{" "}
            </Text>
            <Text fontSize='md' color={secondaryTextColor} fontWeight='400'>
              {name}
            </Text>
          </Flex>

          {/* Numéro de téléphone */}
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Mobile:{" "}
            </Text>
            <Text fontSize='md' color={secondaryTextColor} fontWeight='400'>
              {mobile}
            </Text>
          </Flex>

          {/* Adresse e-mail */}
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Email:{" "}
            </Text>
            <Text fontSize='md' color={secondaryTextColor} fontWeight='400'>
              {email}
            </Text>
          </Flex>

          {/* Localisation */}
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Location:{" "}
            </Text>
            <Text fontSize='md' color={secondaryTextColor} fontWeight='400'>
              {location}
            </Text>
          </Flex>

          {/* Réseaux sociaux */}
          <Flex align='center' mb='18px'>
            <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
              Social Media:{" "}
            </Text>
            <Flex>
              <Link href='#' color='teal.300' fontSize='lg' me='10px' _hover={{ color: "teal.400" }}>
                <Icon as={FaFacebook} />
              </Link>
              <Link href='#' color='teal.300' fontSize='lg' me='10px' _hover={{ color: "teal.400" }}>
                <Icon as={FaInstagram} />
              </Link>
              <Link href='#' color='teal.300' fontSize='lg' me='10px' _hover={{ color: "teal.400" }}>
                <Icon as={FaTwitter} />
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </Card>
  );
};

// Validation des props
ProfileInformation.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
};

export default ProfileInformation;
