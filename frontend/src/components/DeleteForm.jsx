const DeleteForm = ({ rowObject, backendURL, refresh }) => {

    return (
        <td>
            <form>
                <button type='submit'>
                    Delete
                </button>
            </form>
        </td>

    );
};

export default DeleteForm;