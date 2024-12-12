import React from "react";
import PropTypes from "prop-types";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Avatar, Box, Typography, IconButton, Grid, Divider, Button } from "@mui/material";

const ProfileInformation = ({
  title,
  description,
  name,
  mobile,
  email,
  location,
  avatarUrl,
  onManageProfileClick, // Ajout de la fonction pour gérer le clic
}) => {
  // Colors for styling
  const textColor = "#4A5568"; // Dark gray
  const secondaryTextColor = "#A0AEC0"; // Light gray
  const accentColor = "#00796b"; // Accent color for links/icons

  return (
    <Box padding={3} marginBottom={4} boxShadow={5} borderRadius={2} bgcolor="#fff">
      {/* Header with title and avatar */}
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{ width: 72, height: 72, marginRight: 2 }}
        />
        <Typography variant="h5" color={textColor} fontWeight="600">
          {title}
        </Typography>
      </Box>

      {/* Profile Information */}
      <Box>
        <Grid container direction="column">
          {/* Description */}
          <Typography
            variant="body1"
            color={secondaryTextColor}
            fontWeight="400"
            marginBottom={4}
          >
            {description}
          </Typography>

          {/* Full Name */}
          <Grid item container alignItems="center" marginBottom={2}>
            <Typography
              variant="body2"
              color={textColor}
              fontWeight="600"
              marginRight={2}
            >
              Full Name:
            </Typography>
            <Typography variant="body2" color={secondaryTextColor}>
              {name}
            </Typography>
          </Grid>

          {/* Mobile */}
          <Grid item container alignItems="center" marginBottom={2}>
            <Typography
              variant="body2"
              color={textColor}
              fontWeight="600"
              marginRight={2}
            >
              Mobile:
            </Typography>
            <Typography variant="body2" color={secondaryTextColor}>
              {mobile}
            </Typography>
          </Grid>

          {/* Email */}
          <Grid item container alignItems="center" marginBottom={2}>
            <Typography
              variant="body2"
              color={textColor}
              fontWeight="600"
              marginRight={2}
            >
              Email:
            </Typography>
            <Typography variant="body2" color={secondaryTextColor}>
              {email}
            </Typography>
          </Grid>

          {/* Location */}
          <Grid item container alignItems="center" marginBottom={2}>
            <Typography
              variant="body2"
              color={textColor}
              fontWeight="600"
              marginRight={2}
            >
              Location:
            </Typography>
            <Typography variant="body2" color={secondaryTextColor}>
              {location}
            </Typography>
          </Grid>

          {/* Divider */}
          <Divider sx={{ margin: "16px 0", bgcolor: "#e0e0e0" }} />

          {/* Social Media */}
          <Grid item container alignItems="center" marginBottom={2}>
            <Typography
              variant="body2"
              color={textColor}
              fontWeight="600"
              marginRight={2}
            >
              Social Media:
            </Typography>
            <Box>
              <IconButton
                href="#"
                color="primary"
                sx={{
                  marginRight: 2,
                  "&:hover": { backgroundColor: "#f0f0f0", borderRadius: "50%" },
                }}
              >
                <FaFacebook />
              </IconButton>
              <IconButton
                href="#"
                color="primary"
                sx={{
                  marginRight: 2,
                  "&:hover": { backgroundColor: "#f0f0f0", borderRadius: "50%" },
                }}
              >
                <FaInstagram />
              </IconButton>
              <IconButton
                href="#"
                color="primary"
                sx={{
                  marginRight: 2,
                  "&:hover": { backgroundColor: "#f0f0f0", borderRadius: "50%" },
                }}
              >
                <FaTwitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Manage Profile Button */}
          <Grid item container justifyContent="flex-end" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={onManageProfileClick}  // Fonction pour gérer le clic
              sx={{
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "600",
                textTransform: "uppercase",
                "&:hover": { backgroundColor: "#00796b" },
              }}
            >
              Manage Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Prop validation
ProfileInformation.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  onManageProfileClick: PropTypes.func.isRequired, // Validation de la fonction pour gérer le clic
};

export default ProfileInformation;
