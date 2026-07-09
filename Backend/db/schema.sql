CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    token_count INT UNSIGNED NOT NULL default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- pass user1=zLF[6w!GiV3P40Fp
--#Chatgptpassword55