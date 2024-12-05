export type SidebarProps = {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
    openSubMenu: string | null;
    setOpenSubMenu: (segment: string | null) => void;
  };
  
  export type MenuItem = {
    $id: string;
    MenuName: string;
    MenuID: number;
    MainManuID: number;
    MenuType: string;
    EmpID: number;
    EmpName: string | null;
    Type: string | null;
    ListMenuID: string | null;
  };
  
  export type NavigationChild = {
    segment: string;
    title: string;
    path: string;
  };
  
  export type NavigationItem = {
    segment: string;
    title: string;
    icon?: JSX.Element;
    children?: NavigationChild[];
  };
  