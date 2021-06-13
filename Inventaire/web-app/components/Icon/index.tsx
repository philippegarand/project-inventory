import { IconProps } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Assignment from '@material-ui/icons/Assignment';
import BorderAll from '@material-ui/icons/BorderAll';
import CropFree from '@material-ui/icons/CropFree';
import Dashboard from '@material-ui/icons/Dashboard';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import EventNote from '@material-ui/icons/EventNote';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Home from '@material-ui/icons/Home';
import HomeWork from '@material-ui/icons/HomeWork';
import Lock from '@material-ui/icons/Lock';
import Menu from '@material-ui/icons/Menu';
import People from '@material-ui/icons/People';
import Settings from '@material-ui/icons/Settings';

export const iconsList = {
  Add,
  ArrowBack,
  Assignment,
  BorderAll,
  CropFree,
  Dashboard,
  Delete,
  Edit,
  EventNote,
  ExpandMore,
  Home,
  HomeWork,
  Lock,
  Menu,
  People,
  Settings,
};

interface IProps extends IconProps {
  icon: keyof typeof iconsList;
  className?: any;
}

export default function Icon(props: IProps) {
  const { className, icon, ...otherProps } = props;

  const Icon = iconsList[icon];

  // @ts-ignore
  return <Icon {...otherProps} className={className} />;
}
