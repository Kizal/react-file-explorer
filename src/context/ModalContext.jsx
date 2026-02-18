import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/ui/Modal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        content: null,
        footer: null,
    });

    const openModal = useCallback(({ title, content, footer }) => {
        setModalState({
            isOpen: true,
            title,
            content,
            footer
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                footer={modalState.footer}
            >
                {modalState.content}
            </Modal>
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
