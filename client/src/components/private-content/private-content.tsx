import { useSelector } from 'react-redux';
import { Error } from '..';
import { ERROR } from '../../constants';
import { checkAccess } from '../../utils';
import { selectError, selectUser } from '../../redux/selectors';

export const PrivateContent = ({ children, access }: { children: JSX.Element; access: string[] }) => {
	const userRole = useSelector(selectUser).roleId;

	const serverError = useSelector(selectError).error;

	const accessError = checkAccess(access, userRole?.toString() as string) ? null : ERROR.ACCESS_DENIED;
	const error = serverError || accessError;

	return error ? <Error error={error} /> : children;
};
