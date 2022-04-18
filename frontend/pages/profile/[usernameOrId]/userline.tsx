import {
    Box, Button, CircularProgress, Container, Divider, Grid, Skeleton, Stack, Tab, Tabs, Typography, styled, Chip,
} from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    SyntheticEvent, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { followUser, getUser, unfollowUser } from '../../../src/api/user';
import { getProfile } from '../../../src/api/user/profile';
import Helmet from '../../../src/components/common/Helmet';
import Link from '../../../src/components/common/Link';
import ProfileAvatar from '../../../src/components/common/ProfileAvatar';
import LazyPost from '../../../src/components/LazyPost';
import LazyUserCard from '../../../src/components/LazyUserCard';
import UserNavbar from '../../../src/components/navbar/user';
import { setCurrentUser } from '../../../src/store';
import { ReduxStoreType } from '../../../src/types/redux';
import { ProfileType } from '../../../src/types/user';
import { TOAST_OPTIONS } from '../../../src/constants/toast';
