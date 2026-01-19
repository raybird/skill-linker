#!/bin/bash

# link-skill.sh
# Interactive script to link AI Agent Skills to various AI agents
DEFAULT_LIB_PATH="$HOME/Documents/AgentSkills"
SKILL_PATH=""
FROM_URL=""

# Helper function for colored output
print_info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
print_success() { echo -e "\033[1;32m[SUCCESS]\033[0m $1"; }
print_warning() { echo -e "\033[1;33m[WARNING]\033[0m $1"; }
print_error() { echo -e "\033[1;31m[ERROR]\033[0m $1"; }

# Show help
show_help() {
    echo "Usage: link-skill.sh [OPTIONS] [SKILL_PATH]"
    echo ""
    echo "Options:"
    echo "  --from <github_url>   Clone skill from GitHub URL first, then link"
    echo "  --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./link-skill.sh                           # Interactive selection from library"
    echo "  ./link-skill.sh /path/to/skill            # Link specific local skill"
    echo "  ./link-skill.sh --from https://github.com/user/my-skill"
    echo ""
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --from)
            FROM_URL="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            ;;
        *)
            SKILL_PATH="$1"
            shift
            ;;
    esac
done

# 1. Handle --from flag: Clone from GitHub
if [ -n "$FROM_URL" ]; then
    # Extract repo name from URL
    REPO_NAME=$(basename "$FROM_URL" .git)
    TARGET_CLONE_PATH="$DEFAULT_LIB_PATH/$REPO_NAME"
    
    # Ensure library directory exists
    mkdir -p "$DEFAULT_LIB_PATH"
    
    if [ -d "$TARGET_CLONE_PATH" ]; then
        print_warning "Directory already exists: $TARGET_CLONE_PATH"
        read -p "Update with git pull? (y/N): " do_pull
        if [[ "$do_pull" =~ ^[yY]$ ]]; then
            print_info "Pulling latest changes..."
            git -C "$TARGET_CLONE_PATH" pull
        fi
    else
        print_info "Cloning $FROM_URL to $TARGET_CLONE_PATH..."
        git clone "$FROM_URL" "$TARGET_CLONE_PATH"
        if [ $? -ne 0 ]; then
            print_error "Failed to clone repository"
            exit 1
        fi
        print_success "Clone completed!"
    fi
    
    SKILL_PATH="$TARGET_CLONE_PATH"
fi

# 2. Determine Source Skill Path (if not already set by --from)
if [ -z "$SKILL_PATH" ]; then
    # Check if default library exists
    if [ -d "$DEFAULT_LIB_PATH" ]; then
        print_info "No skill path provided. Checking default library: $DEFAULT_LIB_PATH"
        skills=("$DEFAULT_LIB_PATH"/*/)
        
        if [ ${#skills[@]} -eq 0 ]; then
            print_error "No skills found in $DEFAULT_LIB_PATH"
            print_info "Please provide a skill path: ./link-skill.sh <path_to_skill>"
            exit 1
        fi

        # Extract skill names for display
        skill_names=()
        for s in "${skills[@]}"; do
            skill_names+=("$(basename "$s")")
        done

        echo "Available Skills:"
        select skill_name in "${skill_names[@]}"; do
            if [ -n "$skill_name" ]; then
                SKILL_PATH="${DEFAULT_LIB_PATH}/${skill_name}"
                break
            else
                echo "Invalid selection. Please try again."
            fi
        done
    else
        # Fallback to current directory prompt
        read -p "Enter path to skill directory (default: current dir): " input_path
        input_path=${input_path:-.}
        SKILL_PATH=$(realpath "$input_path")
    fi
elif [ -n "$SKILL_PATH" ] && [ -z "$FROM_URL" ]; then
    # Path provided directly as argument
    SKILL_PATH=$(realpath "$SKILL_PATH")
fi

if [ ! -d "$SKILL_PATH" ]; then
    print_error "Skill directory not found: $SKILL_PATH"
    exit 1
fi

SKILL_NAME=$(basename "$SKILL_PATH")
print_info "Selected Skill: \033[1;36m$SKILL_NAME\033[0m ($SKILL_PATH)"

# 2. Define Supported Agents
# Format: "Name:ProjectDir:GlobalDir"
AGENTS=(
    "Claude Code:.claude/skills:$HOME/.claude/skills"
    "GitHub Copilot:.github/skills:$HOME/.copilot/skills"
    "Google Antigravity:.agent/skills:$HOME/.gemini/antigravity/skills"
    "Cursor:.cursor/skills:$HOME/.cursor/skills"
    "OpenCode:.opencode/skill:$HOME/.config/opencode/skill"
    "OpenAI Codex:.codex/skills:$HOME/.codex/skills"
    "Gemini CLI:.gemini/skills:$HOME/.gemini/skills"
    "Windsurf:.windsurf/skills:$HOME/.codeium/windsurf/skills"
)

# 3. Agent Selection
echo ""
echo "Select Agents to install to (Space to select, Enter to confirm):"
# Simple multi-select implementation using arrays
selected_indices=()
while true; do
    for i in "${!AGENTS[@]}"; do
        agent_info="${AGENTS[$i]}"
        agent_name="${agent_info%%:*}"
        
        # Check if selected
        if [[ " ${selected_indices[*]} " =~ " $i " ]]; then
            mark="[*]"
        else
            mark="[ ]"
        fi
        echo "$i) $mark $agent_name"
    done
    
    echo "a) Select All"
    echo "d) Done"
    read -p "Select option: " choice

    if [[ "$choice" == "d" ]]; then
        break
    elif [[ "$choice" == "a" ]]; then
        selected_indices=()
        for i in "${!AGENTS[@]}"; do
            selected_indices+=("$i")
        done
    elif [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 0 ] && [ "$choice" -lt "${#AGENTS[@]}" ]; then
        if [[ " ${selected_indices[*]} " =~ " $choice " ]]; then
            # Deselect
            new_indices=()
            for idx in "${selected_indices[@]}"; do
                [[ "$idx" != "$choice" ]] && new_indices+=("$idx")
            done
            selected_indices=("${new_indices[@]}")
        else
            # Select
            selected_indices+=("$choice")
        fi
    else
        echo "Invalid choice."
    fi
    echo "------------------------"
done

if [ ${#selected_indices[@]} -eq 0 ]; then
    print_warning "No agents selected. Exiting."
    exit 0
fi

# 4. Process Each Selected Agent
for idx in "${selected_indices[@]}"; do
    agent_raw="${AGENTS[$idx]}"
    IFS=':' read -r agent_name project_dir global_dir <<< "$agent_raw"
    
    echo ""
    print_info "Configuring for \033[1;36m$agent_name\033[0m..."
    
    # Scope Selection
    echo "Select Scope:"
    echo "1) Project ($project_dir)"
    echo "2) Global ($global_dir)"
    echo "3) Both"
    echo "s) Skip"
    read -p "Choice [1-3]: " scope_choice

    targets=()
    case $scope_choice in
        1) targets+=("$project_dir") ;;
        2) targets+=("$global_dir") ;;
        3) targets+=("$project_dir" "$global_dir") ;;
        s|S) continue ;;
        *) print_warning "Invalid choice, skipping $agent_name"; continue ;;
    esac

    for target_base in "${targets[@]}"; do
        # Resolve path expansion if needed (already expanded in definition for Global, Project is relative)
        if [[ "$target_base" == /* ]]; then
            # Absolute path (Global)
            target_dir="$target_base"
        else
            # Relative path (Project) - assume current dir is project root
            target_dir="$(pwd)/$target_base"
        fi
        
        # Ensure target parent directory exists
        if [ ! -d "$target_dir" ]; then
            print_info "Creating directory: $target_dir"
            mkdir -p "$target_dir"
        fi

        target_link="$target_dir/$SKILL_NAME"

        # Check for existing link or directory
        if [ -e "$target_link" ] || [ -L "$target_link" ]; then
            print_warning "$target_link already exists."
            read -p "Overwrite? (y/N): " overwrite
            if [[ "$overwrite" =~ ^[yY]$ ]]; then
                rm -rf "$target_link"
            else
                print_info "Skipping..."
                continue
            fi
        fi

        # Create Symlink
        ln -s "$SKILL_PATH" "$target_link"
        if [ $? -eq 0 ]; then
            print_success "Linked to $target_link"
        else
            print_error "Failed to link to $target_link"
        fi
    done
done

echo ""
print_success "All operations completed."
