module stream_tips_addr::tip_jar {
    use std::signer;
    use std::string::{String};
    use std::table::{Self, Table};
    use aptos_framework::aptos_account;
    use aptos_framework::account;
    use aptos_framework::event;

    // Add a global resource to store creator link mappings
    struct CreatorLinkRegistry has key {
        links: Table<String, address>
    }

    struct TipSentEvent has drop, store {
        tipper: address,
        streamer: address,
        amount: u64,
        message: String,
    }

    struct TipJar has key {
        total_tipped_amount: u64,
        creator_link: String,
        tip_events: event::EventHandle<TipSentEvent>,
    }

    const E_JAR_NOT_INITIALIZED: u64 = 1;
    const E_CANNOT_TIP_YOURSELF: u64 = 2;
    const E_CREATOR_LINK_TOO_LONG: u64 = 3;
    const E_MESSAGE_TOO_LONG: u64 = 4;
    const E_CREATOR_LINK_ALREADY_EXISTS: u64 = 5;
    const E_CREATOR_LINK_REGISTRY_NOT_INITIALIZED: u64 = 6;
    const E_CREATOR_LINK_TOO_SHORT: u64 = 7;
    const E_USER_ALREADY_HAS_CREATOR_LINK: u64 = 8;

    // Initialize the CreatorLinkRegistry if it doesn't exist
    public entry fun initialize_registry(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @stream_tips_addr, 1); // Ensure only module deployer can initialize

        if (!exists<CreatorLinkRegistry>(@stream_tips_addr)) {
            move_to(admin, CreatorLinkRegistry {
                links: table::new()
            });
        }
    }

    public entry fun initialize_tip_jar(streamer: &signer, creator_link: String) acquires CreatorLinkRegistry {
        // Ensure link length is valid
        assert!(creator_link.length() <= 15, E_CREATOR_LINK_TOO_LONG);
        assert!(creator_link.length() >= 4, E_CREATOR_LINK_TOO_SHORT);
        
        // Ensure registry exists
        if (!exists<CreatorLinkRegistry>(@stream_tips_addr)) {
            initialize_registry(streamer);
        };

         // Check if user already has a TipJar (preventing multiple creator links)
        let streamer_address = signer::address_of(streamer);
        assert!(!exists<TipJar>(streamer_address), E_USER_ALREADY_HAS_CREATOR_LINK);


        // Check if creator link is unique
        let registry = borrow_global_mut<CreatorLinkRegistry>(@stream_tips_addr);
        assert!(!registry.links.contains(creator_link), E_CREATOR_LINK_ALREADY_EXISTS);

        // Add creator link to registry
        registry.links.add(creator_link, streamer_address);

        // Create TipJar for the streamer
        move_to(streamer, TipJar {
            total_tipped_amount: 0,
            creator_link,
            tip_events: account::new_event_handle<TipSentEvent>(streamer),
        });
    }

    #[view]
    public fun get_creator_address_by_link(creator_link: String): address acquires CreatorLinkRegistry {
        // Ensure registry exists
        assert!(exists<CreatorLinkRegistry>(@stream_tips_addr), E_CREATOR_LINK_REGISTRY_NOT_INITIALIZED);

        // Lookup and return the address
        let registry = borrow_global<CreatorLinkRegistry>(@stream_tips_addr);
        *registry.links.borrow(creator_link)
    }

    // Existing functions remain the same...
    public entry fun send_tip(tipper: &signer, streamer_address: address, amount: u64, message: String) acquires TipJar {
        let tipper_address = signer::address_of(tipper);

        assert!(tipper_address != streamer_address, E_CANNOT_TIP_YOURSELF);
        assert!(exists<TipJar>(streamer_address), E_JAR_NOT_INITIALIZED);
        assert!(message.length() <= 30, E_MESSAGE_TOO_LONG);
        
        aptos_account::transfer_coins<aptos_framework::aptos_coin::AptosCoin>(tipper, streamer_address, amount);

        let jar = borrow_global_mut<TipJar>(streamer_address);
        jar.total_tipped_amount += amount;

        event::emit_event(
            &mut jar.tip_events,
            TipSentEvent {
                tipper: tipper_address,
                streamer: streamer_address,
                amount,
                message,
            }
        );
    }

    // Additional utility functions
    #[view]
    public fun creator_link_exists(creator_link: String): bool acquires CreatorLinkRegistry {
        exists<CreatorLinkRegistry>(@stream_tips_addr) && 
        borrow_global<CreatorLinkRegistry>(@stream_tips_addr).links.contains(creator_link)
    }
}