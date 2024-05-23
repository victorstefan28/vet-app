import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";

interface LinkCardProps {
  title: string;
  description?: string;
  to: string; // Path for navigation
  icon?: React.ReactNode;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  title,
  description,
  to,
  icon,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent full page reload
    navigate(to);
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        "&:hover": { boxShadow: theme.shadows[5] },
        marginBottom: "10px",

        background: theme.palette.primary.main,
      }}
      onClick={handleClick}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="h5" component="h2" color="white">
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="#CCC">
                {description}
              </Typography>
            )}
          </div>
          {icon && <Icon sx={{ color: "white" }}>{icon}</Icon>}
        </div>
      </CardContent>
    </Card>
  );
};
