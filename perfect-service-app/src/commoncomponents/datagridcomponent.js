const DataGridComponent = (props) => {

    const rowClick = (row) => {
        props.getSelectedRow(row);
    }


    if (props.dataSource === undefined || props.dataSource.length === 0) {
        return (
            <div className="container">
                <strong>
                    No records to display
                </strong>
            </div>
        );
    } else {
        // 1. read all keys

        const columns = Object.keys(props.dataSource[0]);

        return (
            <div className="datagridtabletopmargin">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            {
                                columns.map((c, i) => (
                                    <th className="allbookingstablehead" key={i}>
                                        {c.toUpperCase()}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.dataSource.map((row, rIndex) => (
                                <tr key={rIndex} onClick={() => rowClick(row)}>
                                    {
                                        columns.map((col, cIndex) => (
                                            <td key={cIndex}>
                                                {row[col]}
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>);
    }


};

export default DataGridComponent;