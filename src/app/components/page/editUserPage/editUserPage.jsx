import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useProfessions } from "../../../hooks/useProfession";
import { useAuth } from "../../../hooks/useAuth";
import { useQualities } from "../../../hooks/useQualities";

const EditUserPage = () => {
    const { userId } = useParams();
    const history = useHistory();
    const { currentUser, updateData } = useAuth();
    const { professions } = useProfessions();
    const { qualities: qualData } = useQualities();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(currentUser);

    const [userProf, setUserProf] = useState([]);
    const [qual, setQual] = useState([]);
    const [errors, setErrors] = useState({});

    const getQualities = (elements) => {
        const qualitiesArray = [];
        for (const elem of elements) {
            for (const quality of qualData) {
                if (elem === quality._id) {
                    qualitiesArray.push({
                        value: quality._id,
                        label: quality.name,
                        color: quality.color
                    });
                }
            }
        }
        return qualitiesArray;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        console.log(isValid);
        // setData((prevState) => ({
        //     ...prevState,
        //     qualities: prevState.qualities.map((q) => q.value)
        // }));
        updateData(data);
        history.push(`/users/${userId}`);
    };

    useEffect(async () => {
        setIsLoading(true);
        setData({
            ...data,
            qualities: getQualities(data.qualities)
        });
        const professionsList = Object.keys(professions).map(
            (professionName) => ({
                label: professions[professionName].name,
                value: professions[professionName]._id
            })
        );

        const qualitiesList = Object.keys(qualData).map((optionName) => ({
            value: qualData[optionName]._id,
            label: qualData[optionName].name,
            color: qualData[optionName].color
        }));
        setUserProf(professionsList);
        setQual(qualitiesList);
    }, []);
    console.log(data);
    useEffect(() => {
        if (data._id) setIsLoading(false);
    }, [data]);

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Введите ваше имя"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;

    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isLoading && Object.keys(userProf).length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={userProf}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qual}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
