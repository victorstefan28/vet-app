import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  useTheme,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path?: string; // For routing, if needed
  subItems?: SidebarItem[];
}

interface ExpandableSidebarProps {
  items: SidebarItem[];
  width: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ExpandableSidebar: React.FC<ExpandableSidebarProps> = ({
  items,
  width,
  open,
  setOpen,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const theme = useTheme();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) setExpandedItems([]);
  }, [open]);

  const handleItemClick = (index: number) => {
    if (!items[index].subItems || !items[index].subItems.length) {
      console.log("No subItems for this item");
      navigate(items[index].path);
      return;
    }
    if (!open) {
      toggleDrawer();
    }

    const itemLabel = items[index].label;
    setExpandedItems(
      expandedItems.includes(itemLabel)
        ? expandedItems.filter((label) => label !== itemLabel)
        : [...expandedItems, itemLabel]
    );
  };

  return (
    <>
      <Drawer variant="permanent" open={open} sx={{}}>
        <Box
          sx={{
            width: open ? width : "55px",
            transition: theme.transitions.create(["width"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            overflow: "hidden",
          }}
        >
          <IconButton onClick={toggleDrawer} sx={{ pl: 2 }}>
            <MenuIcon />
          </IconButton>
          <List>
            {items.map((item, index) => (
              <React.Fragment key={item.label}>
                <ListItem button onClick={() => handleItemClick(index)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {item.subItems &&
                    (expandedItems.includes(item.label) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItem>
                {item.subItems && (
                  <Collapse
                    in={expandedItems.includes(item.label)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem
                          button
                          key={subItem.label}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            navigate(subItem.path);
                          }}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.label} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ExpandableSidebar;
