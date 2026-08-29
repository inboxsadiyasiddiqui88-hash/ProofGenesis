import "../../styles/ui.css";

function StatCard({

    title,

    value,

    icon,

    color

}){

    return(

        <div className="stat-card">

            <div>

                <p className="stat-title">

                    {title}

                </p>

                <h2>

                    {value}

                </h2>

            </div>

            <div

                className="stat-icon"

                style={{

                    background:color

                }}

            >

                {icon}

            </div>

        </div>

    );

}

export default StatCard;